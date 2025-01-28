const dependentDocs = {
    schemas: {
      Dependent: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Artur Silva' },
          collaboratorId: { type: 'integer', example: 1 },
          adminId: { type: 'integer', example: 1 },
          parentesco: { type: 'string', example: 'Filho' },
        },
      },
    },
    paths: {
      '/dependent': {
        get: {
          tags: ['Dependent'],
          summary: 'Listar Dependentes',
          responses: {
            200: {
              description: 'Lista de dependentes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Dependent' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Dependent'],
          summary: 'Adicionar Dependente',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Dependent',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Dependente adicionado com sucesso',
            },
          },
        },
      },
      '/dependent/{id}': {
        get: {
          tags: ['Dependent'],
          summary: 'Obter Dependente por ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do dependente',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Dependente encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Dependent',
                  },
                },
              },
            },
            404: { description: 'Dependente não encontrado' },
          },
        },
        put: {
          tags: ['Dependent'],
          summary: 'Atualizar Dependente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do dependente',
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Dependent',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Dependente atualizado com sucesso',
            },
          },
        },
        delete: {
          tags: ['Dependent'],
          summary: 'Excluir Dependente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do dependente',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Dependente excluído com sucesso',
            },
          },
        },
      },
    },
  };
  
  module.exports = dependentDocs;
  