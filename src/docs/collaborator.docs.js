const collaboratorDocs = {
    schemas: {
      Collaborator: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Artur Silva' },
          CPF: { type: 'string', example: '123.456.789-00' },
          adminId: { type: 'integer', example: 1 },
          cargo: { type: 'string', example: 'Desenvolvedor' }
        },
      },
    },
    paths: {
      '/collaborator': {
        get: {
          tags: ['Collaborator'],
          summary: 'Listar Colaboradores',
          responses: {
            200: {
              description: 'Lista de colaboradores',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Collaborator' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Collaborator'],
          summary: 'Adicionar Colaborador',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Collaborator',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Colaborador adicionado com sucesso',
            },
          },
        },
      },
      '/collaborator/search-name': {
        get: {
          tags: ['Collaborator'],
          summary: 'Buscar Colaboradores por Nome',
          parameters: [
            {
              name: 'name',
              in: 'query',
              required: true,
              description: 'Nome do colaborador a ser buscado',
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Lista de colaboradores encontrados',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Collaborator' },
                  },
                },
              },
            },
            400: {
              description: 'Nome não fornecido na query',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { error: { type: 'string' } } },
                },
              },
            },
            404: {
              description: 'Nenhum colaborador encontrado com o nome fornecido',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { error: { type: 'string' } } },
                },
              },
            },
            500: {
              description: 'Erro ao buscar colaboradores por nome',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { error: { type: 'string' } } },
                },
              },
            },
          },
        },
      },
      '/collaborator/search-cpf': {
        get: {
          tags: ['Collaborator'],
          summary: 'Buscar Colaborador por CPF',
          parameters: [
            {
              name: 'CPF',
              in: 'query',
              required: true,
              description: 'CPF do colaborador a ser buscado',
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Colaborador encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Collaborator' },
                },
              },
            },
            400: {
              description: 'CPF não fornecido na query',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { error: { type: 'string' } } },
                },
              },
            },
            404: {
              description: 'Nenhum colaborador encontrado com o CPF fornecido',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { error: { type: 'string' } } },
                },
              },
            },
            500: {
              description: 'Erro ao buscar colaborador por CPF',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { error: { type: 'string' } } },
                },
              },
            },
          },
        },
      },
      '/collaborator/{id}': {
        get: {
          tags: ['Collaborator'],
          summary: 'Obter Colaborador por ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do colaborador',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Colaborador encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Collaborator' },
                },
              },
            },
            404: {
              description: 'Colaborador não encontrado',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { error: { type: 'string' } } },
                },
              },
            },
          },
        },
        put: {
          tags: ['Collaborator'],
          summary: 'Atualizar Colaborador',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do colaborador',
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Collaborator',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Colaborador atualizado com sucesso',
            },
          },
        },
        delete: {
          tags: ['Collaborator'],
          summary: 'Excluir Colaborador',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do colaborador',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Colaborador excluído com sucesso',
            },
          },
        },
      },
    },
  };
  
  module.exports = collaboratorDocs;
  