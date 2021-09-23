const ErrorsHandler = require('./handler');

module.exports = {
  name: 'errors',
  register: async (server) => {
    const errorsHandler = new ErrorsHandler();
    server.ext('onPreResponse', errorsHandler.errorsHandler);
  },
};
