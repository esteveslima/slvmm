import { lambda, logger, middleware } from '@sls/lib';
import * as dynamoose from 'dynamoose';
import * as faker from 'faker';

middleware.before((event) => { logger.log('insertDataDynamoDB'); });

const { IS_OFFLINE } = process.env;

export default lambda(async (event) => {
  if (IS_OFFLINE) {
    dynamoose.aws.ddb.local('http://dynamodb-container:8000');
    logger.log('local');
  }

  // Beware of options, risk of high costs and throttling
  const schemaOptions = {
    create: !!IS_OFFLINE, // this option attempt to create the table(recommended to be false on production, with the table created beforehand, activating only on local environment)
    waitForActive: {
      enabled: !!IS_OFFLINE, // wait for the table to be active(recommended to be false on production, activating only on local environment)
      // check: {timeout: 180000, frequency: 1000,}
    },
    // Below properties change table config, do not use it(use aws console to config table)
    // expires: { ttl: 8640000, items: { returnExpired: true } },       // set table ttl
    // throughput: { read: 1, write: 1 }, // throughput: 'ON_DEMAND',   // set table throughput
    // update: ['ttl', 'throughput'],                                   // enable update table capacities to the model config
  };

  // TODO: study better model structures for this template(& look for indexes to better queries)
  // USEFUL DESIGNS: https://www.serverlesslife.com/DynamoDB_Design_Patterns_for_Single_Table_Design.html

  // NoSQL document orientaded with transactions not ACID atomic/isolated.
  // Useful for scalable and high performance dynamic data structures with a single static lookup access.

  // Choose the schema carefully, DynamoDB is not suitable to query data cost-effectivelly. Custom indexes on properties are possible with extra costs.
  // Commonlly used with direct lookups(only hashkey as input for their hash function) with and optional usage of a secondary parameter for useful queries(rangekey), tables should be designed to store data in the way it's intended to be read.
  // It's a good approach to use a composite hashkey(data1_data2...) to cover multiple possibilities on fetching data(also avoiding overusing a hightly demanded hashkey partition).
  // This implies that the table would be searchable only with multiple known informations.

  // Simple example of a model which can be queried only by it's hashkey
  const musicSchema = new dynamoose.Schema({
    name: {
      type: String,
      hashKey: true, // explicetely defining the hashkey
      required: true,
    },
    style: {
      type: String,
      enum: ['Rock', 'Pop', 'Classic', 'Jazz', 'Funk'],
      required: true,
    },
    released: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
    },
    subjects: {
      type: Array,
      schema: [String],
      required: true,
    },
  }, {
    saveUnknown: true, // allow properties not defined in schema
    timestamps: true, // enable timestamps for document
  });
  const Music = dynamoose.model('Music', musicSchema, schemaOptions); // create model instance

  // This example assumes a requirement to query musics by style and decade, differentiating by its subjects(merely an example), composing a unique hashkey(composite) + rangekey for each occurance
  // With this structure it's possible to query musics by style and decade more effectivelly
  const musicByStyleDecadeSchema = new dynamoose.Schema({
    style_decade: {
      type: String,
      hashKey: true, // explicetely defining the hashkey(composite)
      validate: /^[^_\s]+_[^_\s]+$/, // limit 2 words separated by single "_"
      required: true,
    },
    subjects: {
      type: String,
      rangeKey: true, // explicetely defining the rangeKey
      required: true,
    },
    music: Music,
  }, {
    saveUnknown: false,
    timestamps: true,
  });
  const MusicByStyleDecade = dynamoose.model('MusicByStyleDecade', musicByStyleDecadeSchema, schemaOptions);

  // create new documents
  const music = {
    id: faker.datatype.uuid(), // extra unknown field
    name: faker.name.findName(),
    style: ['Rock', 'Pop', 'Classic', 'Jazz', 'Funk'][faker.datatype.number(4)],
    released: new Date(faker.date.past(100)),
    duration: faker.datatype.number(600),
    subjects: faker.random.words(10).split(' '),
  };
  const createdMusic = await Music.create(music);
  logger.log('createdMusic');
  logger.log(createdMusic);

  const musicByStyleDecade = {
    style_decade: (() => {
      const { style } = music;
      const decade = Math.floor((new Date(music.released)).getFullYear() / 10) * 10;
      return `${style}_${decade}`;
    })(),
    subjects: music.subjects.join(','),
    music,
  };
  const createdMusicByStyleDecade = await MusicByStyleDecade.create(musicByStyleDecade);
  logger.log('createdMusicByStyleDecade');
  logger.log(createdMusicByStyleDecade);

  // Prefer to use direct lookups, which requires the combination(unique) of hashKey & sortKey(if existant)
  const foundMusic = await Music.get({
    name: music.name,
  }, {
    attributes: undefined, // all attributes
    consistent: undefined, // non consistant operation(non completely reliable cost-effective)
  });
  logger.log(`foundMusic: ${music.name}`);
  logger.log(foundMusic);

  const foundMusicByStyleDecade = await MusicByStyleDecade.get({
    style_decade: musicByStyleDecade.style_decade,
    subjects: musicByStyleDecade.subjects,
  }, {
    attributes: undefined,
    consistent: undefined,
  });
  logger.log(`foundMusicByStyleDecade: ${musicByStyleDecade.style_decade} / ${musicByStyleDecade.musicKey}`);
  logger.log(foundMusicByStyleDecade);
  logger.log(await foundMusicByStyleDecade.populate());

  // Use QUERY over SCAN operations(expensive transaction which iterates over the table before filtering, useful to retrieve flat paginated data).
  // Check the documentation details and confirmation: https://dynamoosejs.com/, https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html
  // PS: package doc may be wrong as reported in an issue, check later for better examples
  const queryMusicByStyleDecade = MusicByStyleDecade.query('style_decade').eq(musicByStyleDecade.style_decade).attributes(['style_decade', 'music']);
  const allMusicByStyleDecade = await queryMusicByStyleDecade.exec();
  logger.log(`allMusicByStyleDecade: ${allMusicByStyleDecade.length}`);
  logger.log(await allMusicByStyleDecade.populate());

  const scanMusicWithFilter = Music.scan().filter('duration').lt(100);
  const allMusicFilterDuration = await scanMusicWithFilter.exec();

  return allMusicFilterDuration;
});
