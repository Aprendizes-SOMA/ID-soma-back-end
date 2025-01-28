const adminDocs = require('./admin.docs');
const collaboratorDocs = require('./collaborator.docs');
const dependentDocs = require('./dependent.docs'); 

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Documentaçao API ID-SOMA',
    version: '1.0.0',
    description: 'API para gerenciamento de administradores, colaboradores e dependentes.',
  },
  servers: [
    {
      url: 'https://id-soma.onrender.com'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ...adminDocs.schemas,
      ...collaboratorDocs.schemas,
      ...dependentDocs.schemas,
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...adminDocs.paths,
    ...collaboratorDocs.paths,
    ...dependentDocs.paths,
  },
};

module.exports = swaggerDocument;
