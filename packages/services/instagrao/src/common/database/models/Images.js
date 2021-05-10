import * as dynamoose from 'dynamoose';
import schemaOptions from '../setup/schema-options';
import setupDynamoose from '../setup/setup-dynamoose';

setupDynamoose(); // setting up dynamoose before entrypoint

// Using a single table design with indexes to avoid scan operations
const imagesSchema = new dynamoose.Schema({
  // Available:
  // image_{key} / image_{key} -> direct lookups to an image data
  // info_{key} / info_{key} -> count info by mimeType(key)
  // info_{key} / {size} -> registered on detect new size limit by mimeType(this way its possible to query the biggest/smallest by sorting)
  // list_types / list_types -> list of mimeTypes(added on info_{key} not found)
  type_key: {
    type: String,
    hashKey: true,
    validate: /^[^_\s]+_[^_\s]+$/, // limit 2 words separated by single "_"
    required: true,
  },

  sk: {
    type: String,
    rangeKey: true,
    required: true,
  },

  // only for image_{key}
  imageData: {
    type: Object,
    schema: {
      contentType: { type: String, required: true },
      size: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    required: false,
  },

  // only for info_{key} / info_{key}
  typeCount: {
    type: Number,
    required: false,
  },

  // only for info_{key} / {size}
  imageReference: {
    type: dynamoose.THIS,
    required: false,
  },

  // only for list_types
  listTypes: {
    type: Array,
    schema: [String],
    required: false,
  },

}, {
  saveUnknown: false,
  timestamps: true,
});

const Images = dynamoose.model('Images', imagesSchema, schemaOptions);

export default Images;
