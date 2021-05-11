# slvmm

Projeto com o intuito de demonstrar um caso de uso de arquitetura serverless, utilizando serviços como Lambda(computing), S3(storage) e DynamoDB(database) da AWS.

![Cenario](./resources/images/Screenshot%20from%202021-05-10%2022-47-41.png)

A situação acima descreve que imagens salvas no S3 devem ter seus dados salvos no DynamoDB, onde poderá ser consultado pela sua chave.

Também deverá prover dados informativos sobre todas as imagens:

 - tipos de imagens salvos
 - total de imagens salvas por tipo
 - maior e menor imagens salvas

<br/><br/><br/>

---

## Arquitetura da solução

Devido ao fato de o DynamoDB ser um banco de dados NoSQL, não é possível realizar pesquisas complexas nos dados salvos de forma eficiente(apenas percorrendo toda a tabela com "scan"), sendo apenas viável buscar dados pela chave(partition key + sort key). Assim, para suprir as necessidades do projeto, a tabela foi construída a fim de receber campos extras de índice.

São 4 tipos de dados salvos na tabela, seguindo o formato '{type}_{key}' da chave de acesso:

| Partition Key | Sort Key      | Descrição     |
| ------------- |:-------------:| -----:|
| image_{key}   | image_{key}   | Sendo {key} a chave da imagem no S3, salva o registro dos dados da imagem, podendo ser consultada apenas pela chave   |
| info_{type}   | info_{type}   | Sendo {type} o mimeType da imagem, salva as informações de um tipo de imagem, podendo ser consultada apenas pelo tipo |
| info_{type}   | {size}        | Sendo {type} o mimeType da imagem e {size} o tamanho da imagem, registra a última imagem identificada como maior/menor|
| list_types    | list_types    | Salva a lista de tipos de imagens, podendo ser consultada diretamente pela chave 'list_types'                         |

<br/>
Utilizando essa estrutura, é possível acessar os dados sobre das imagens da tabela de forma (quase)direta, sacrificando alguns recursos durante o registro de imagens(para verificar novos tipos e tamanhos) mas economizando em não precisar percorrer toda a tabela com um "scan" para levantar dados específicos do problema. 

<br/><br/><br/>

---

## Descrição da solução

A solução foi criada utilizando o Serverless Framework, tendo como base este [template](https://github.com/esteveslima/serverless-template) para desenvolvimento.

(collection do postman em 'Testando a solução')

Foram criadas 5 funções Lambda com Api Gateway para acesso via http: 

 - **uploadImage**: upload da imagem para o s3(em caso de não ser upload direto pelo console da AWS)
   - observação: função criada para propósitos de teste, seguindo padrão da [Collection do Postman](resources/postman/slvmm.postman_collection.json)
   - entrada: arquivo de imagem em 'form-data'
     - (**POST**) https://{{HOST}}/{{STAGE}}/uploadImage/:s3objectkey
   - saída: mensagem de confirmação ou mensagem de erro
 - **getImage**: download da imagem do s3       
   - entrada: chave do s3 na rota do endpoint da API
     - (**GET**) https://{{HOST}}/{{STAGE}}/getImage/:s3objectkey
   - saída: arquivo da imagem solicitada ou mensagem de erro
 - **getMetadata**: dados(tamanho e dimensoes) da imagem     
   - entrada: chave do s3 na rota do endpoint da API
     - (**GET**) https://{{HOST}}/{{STAGE}}/getMetadata/:s3objectkey
   - saída: JSON contendo os dados solicitados ou mensagem de erro
 - **infoImages**: sumário dos dados de todas as imagens salvas
   - descrição:
     - as imagens maiores/menores são recuperadas fazendo uma query pela 'partition key'(info_{type}) e ordenando o resultado de forma crescente/decrescente
   - entrada: nenhuma
     - (**GET**) https://{{HOST}}/{{STAGE}}/infoImages
   - saída: JSON contendo os dados solicitados ou mensagem de erro
 - **extractMetadata**: Função invocada ao evento de uma nova imagem inserida no bucket do S3(com prefixo 'uploads')
   - funcionamento:
     - a imagem é recuperada do S3 utilizando a chave recebida do evento, tendo seus dados extraídos e diretamente salvos no DynamoDB (image_{key}/image_{key})
     - caso seja um novo tipo de imagem, é adicionado este novo tipo à lista de tipos(list_types/list_types) e um novo índice do tipo é salvo(info_{type}/info_{type})
     - incrementa o contador do registro de tipo (info_{type}/info_{type) utilizando uma operação atômica para evitar 'race conditions'
     - caso seja uma imagem maior/menor é feito um novo registro de tamanho(info_{type}/{size}). Obs: {size} com numero fixo de caracteres com 0 a esquerda

<br/><br/><br/>

---

## Testando a solução

O desenvolvimento foi realizado em ambiente linux, podendo haver conflitos em outros sistemas operacionais

<br/>

### Passos iniciais

 - Configure as credenciais da AWS seguindo esses [passos](resources/config/aws/README.md). Resumidamente é necessário criar um arquivo `credentials` com as credenciais no perfil correto dentro de uma pasta `.aws` em `resources/config/aws`(pode requerir acesso admin/sudo).
    - Em caso de não utilizar o container de desenvolvimento, lembrar de colocar as credenciais no perfil correto `aws-cloud` dentro do arquivo `credentials` com escopo geral do computador.
  
 - Instale todas as dependencias na pasta raíz do projeto: `$ npm install`

 - Dentro do diretório do serviço `packages/services/instagrao` Crie o arquivo `.env` seguindo o modelo `.template.env`, modificando os valores(nome do bucket e arn do bucket e tabela no dynamodb) se necessário
   - testes locais não necessitam de modificação do arquivo `.env` mas requerem a criação


    

<br/>

### Ambiente de desenvolvimento com Docker e plugins para testes locais

Na da pasta raiz do projeto, inicie o container de desenvolvimento e entre em seu ambiente shell:

    $ make up   ou   $ npm run docker:up -> para iniciar os containeres
    $ make sh   ou   $ npm run docker:sh -> para entrar no ambiente shell

Navegue até a pasta dos serviços do projeto:

    $ cd packages/services/instagrao 

Para realizar testes locais utilizando plugins do Serverless Framework e DynamoDB Local:

    $ npm run offline   ou   $ npm run sls offline

Com isso se iniciará um servidor local para testes. [Collection do Postman](resources/postman/slvmm.postman_collection.json) para teste dos serviços disponível.

AWS-CLI para o dynamodb local disponíveis através do comando `npm run aws:ddb <comando> -- --<flag1> --<flag2> ...`

<br/>

Para deploy da solução:

**IMPORTANTE**: criar infraestrutura do projeto antes de fazer o deploy das funções, preferencialmente de forma manual, mas também possível através do framework pelo arquivo `packages/services/instagrao-infra`

Lembrar de atualizar o arquivo `.env` antes de realizar o reploy do serviço

    $ npm run sls deploy -- --stage <stage>


Obs: 
 - 1. utilizando serverless local do projeto
 - 2. em caso de erro de dependências com o npm, rode o comando `npm install` novamente também dentro da pasta do serviço

<br/>

### Sem docker

Testes locais não estão configurados para funcionar fora do ambiente do container de desenvolvimento. 

Para fazer o deploy da solução diretamente da máquina seguir os mesmos passos anteriores, se atentando à configuração das credenciais da AWS com o perfil correto.


<br/><br/><br/>

---

## Problemas conhecidos

O uso dessa solução implica em algumas consequências, que não foram tratadas para o propósito desse projeto:
 - Novas registros de imagens maiores/menores acabam deixando os registros anteriores salvos na tabela, sendo potencialmente necessário uma rotina de limpeza 
 - Pode ser potencialmente possível que o contador atômico utilizado para contar o numero de imagens tenha alguma falha em 'race conditions', mas o escopo do projeto deve suportar uma margem de erro
 - Upload de imagens com a mesma chave contabilizam como um novo registro na tabela, seria interessante uma verificação para apagar os registros repetidos.
 - É possível fazer upload/download de qualquer tipo de arquivo, porém somente imagens são contabilizadas
  

Além de problemas sobre a solução, a implementação também possui detalhes que não foram profundamente desenvolvidos para o escopo desse projeto:
 - Testes unitários não foram amplamente desenvolvidos(apesar da estrutura para criação dos testes ter sido ajustada e um arquivo de exemplo(function getImage) ter sido criado)
 - Poucas validações de input e exploração dos possíveis erros(geralmente disparado erro padrão)

**Observação**: Arquivo Serverless para infraestrutura criado, porém é interessante criar o bucket no S3 e a tabela no DynamoDB manualmente(referência em `packages/services/instagrao-infra/serverless.js`):
   - DynamoDB: 'partition key' como 'type_key' e 'sort key' como 'sk', ambos do tipo String. Lembrar de colocar o ARN da tabela criada no arquivo `.env`
   - S3: nome do bucket se possível com nome "instagrao-bucket" para manter o que já está configurado, ou modificar o nome/ARN do bucket criado no arquivo `.env`
   - Obs: É interessante criar a infraestrutura manualmente ou no mínimo através de um arquivo separado das functions, dessa forma evitando perda de dados em caso de problema em alguma etapa de atualização da stack na CloudFormation