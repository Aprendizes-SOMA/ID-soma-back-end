const adminDocs = {
    schemas: {
      Admin: {
        type: "object",
        properties: {
          id: { type: "integer", description: "ID do administrador" },
          username: { type: "string", description: "Nome de usuário do administrador" },
          password: { type: "string", description: "Senha criptografada do administrador" },
        },
        required: ["username", "password"],
      },
      AdminLoginRequest: {
        type: "object",
        properties: {
          username: { type: "string", description: "Nome de usuário" },
          password: { type: "string", description: "Senha" },
        },
        required: ["username", "password"],
      },
      AdminLoginResponse: {
        type: "object",
        properties: {
          message: { type: "string", description: "Mensagem de sucesso" },
          token: { type: "string", description: "Token JWT para autenticação" },
        },
      },
      AdminUpdateRequest: {
        type: "object",
        properties: {
          username: { type: "string", description: "Novo nome de usuário" },
          password: { type: "string", description: "Nova senha" },
        },
      },
      AdminResponse: {
        type: "object",
        properties: {
          id: { type: "integer", description: "ID do administrador" },
          username: { type: "string", description: "Nome de usuário" },
        },
      },
    },
    paths: {
      "/admin/login": {
        post: {
          tags: ["Admin"],
          summary: "Login de administrador",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminLoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login bem-sucedido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AdminLoginResponse" },
                },
              },
            },
            401: {
              description: "Credenciais inválidas",
            },
            500: {
              description: "Erro no servidor",
            },
          },
        },
      },
      "/admin": {
        post: {
          tags: ["Admin"],
          summary: "Adicionar um novo administrador",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Admin" },
              },
            },
          },
          responses: {
            201: {
              description: "Administrador criado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AdminResponse" },
                },
              },
            },
            400: {
              description: "Dados inválidos fornecidos",
            },
            500: {
              description: "Erro no servidor",
            },
          },
        },
        get: {
          tags: ["Admin"],
          summary: "Listar todos os administradores",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de administradores",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/AdminResponse" },
                  },
                },
              },
            },
            500: {
              description: "Erro ao listar administradores",
            },
          },
        },
      },
      "/admin/{id}": {
        put: {
          tags: ["Admin"],
          summary: "Atualizar um administrador",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do administrador a ser atualizado",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminUpdateRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Administrador atualizado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AdminResponse" },
                },
              },
            },
            400: {
              description: "Dados inválidos fornecidos",
            },
            500: {
              description: "Erro ao atualizar administrador",
            },
          },
        },
        delete: {
          tags: ["Admin"],
          summary: "Deletar um administrador",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do administrador a ser deletado",
            },
          ],
          responses: {
            200: {
              description: "Administrador deletado com sucesso",
            },
            500: {
              description: "Erro ao deletar administrador",
            },
          },
        },
      },
    },
  };
  
  module.exports = adminDocs;
  