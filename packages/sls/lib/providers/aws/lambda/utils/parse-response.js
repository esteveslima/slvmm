// Parse results from functions(accepts statusCode and headers in result object) to lambda responses
export default (functionResult) => {
  try {
    if (typeof functionResult === 'object') {
      return {
        statusCode: functionResult.statusCode || 200,
        headers: functionResult.headers || undefined,
        isBase64Encoded: functionResult.isBase64Encoded || undefined,
        body: ((obj) => {
          if (obj.isBase64Encoded && typeof obj.body === 'string') return obj.body;

          const resultObj = JSON.parse(JSON.stringify(obj));
          delete resultObj.statusCode;
          delete resultObj.headers;
          delete resultObj.isBase64Encoded;
          return Object.keys(resultObj).length > 0 ? JSON.stringify(resultObj) : undefined;
        })(functionResult),
      };
    }

    return { statusCode: 200, body: functionResult };
  } catch (err) {
    return { statusCode: 500, body: 'Error on parse response' };
  }
};
