const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Pet Owner API',
        description: 'API for managing pet owners and their pets'
    },
    host: 'localhost:3010',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);