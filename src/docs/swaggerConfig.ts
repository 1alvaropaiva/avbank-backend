import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AVBank API",
      version: "1.0.0",
      description: "API para gerenciamento de contas bancárias do AVBank",
      contact: {
        name: "Suporte AVBank",
        email: "suporte_avbank@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:2854",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/docs/swaggerConfig.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints de autenticação
 *   - name: Accounts
 *     description: Endpoints de contas
 *   - name: Transactions
 *     description: Endpoints de transações
 *
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - login
 *         - cpf
 *         - email
 *         - senha
 *         - saldo
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         login:
 *           type: string
 *           example: "usuario123"
 *         cpf:
 *           type: string
 *           example: "123.456.789-00"
 *         email:
 *           type: string
 *           example: "usuario@example.com"
 *         senha:
 *           type: string
 *           example: "SenhaSegura123"
 *         saldo:
 *           type: number
 *           format: float
 *           example: 1000.50
 *
 *     Transaction:
 *       type: object
 *       required:
 *         - valor
 *       properties:
 *         id:
 *           type: string
 *           example: "101"
 *         accountOrigemId:
 *           type: string
 *           nullable: true
 *           example: "1"
 *         accountDestinoId:
 *           type: string
 *           nullable: true
 *           example: "2"
 *         valor:
 *           type: number
 *           format: float
 *           example: 500
 *         tipo:
 *           type: string
 *           enum: [DEPOSITO, SAQUE, TRANSFERENCIA]
 *           example: "DEPOSITO"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-20T21:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-20T21:30:00Z"
 *
 *     AuthRequest:
 *       type: object
 *       required:
 *         - login
 *         - senha
 *       properties:
 *         login:
 *           type: string
 *           example: "usuario123"
 *         senha:
 *           type: string
 *           example: "SenhaSegura123"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           $ref: '#/components/schemas/Account'
 *
 *     MeResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/Account'
 *
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Faz login e retorna token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Login ou senha inválidos
 *
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Cria uma conta e retorna token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Erro de validação
 *
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Retorna dados do usuário logado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Token inválido ou ausente
 *
 * /accounts:
 *   post:
 *     tags: [Accounts]
 *     summary: Cria uma nova conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Erro interno do servidor
 *   get:
 *     tags: [Accounts]
 *     summary: Lista todas as contas
 *     responses:
 *       200:
 *         description: Lista de contas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       500:
 *         description: Erro interno do servidor
 *
 * /accounts/{id}:
 *   put:
 *     tags: [Accounts]
 *     summary: Atualiza uma conta existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da conta a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Conta atualizada com sucesso
 *       400:
 *         description: Dados inválidos ou erro na requisição
 *       404:
 *         description: Conta não encontrada
 *   delete:
 *     tags: [Accounts]
 *     summary: Deleta uma conta existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da conta a ser deletada
 *     responses:
 *       200:
 *         description: Conta deletada com sucesso
 *       400:
 *         description: ID não informado
 *       404:
 *         description: Conta não encontrada
 *       500:
 *         description: Erro interno do servidor
 *
 * /transactions/deposit:
 *   post:
 *     tags: [Transactions]
 *     summary: Realiza um depósito em uma conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - valor
 *             properties:
 *               accountId:
 *                 type: string
 *                 example: "1"
 *               valor:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Depósito realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Erro na requisição
 *
 * /transactions/withdraw:
 *   post:
 *     tags: [Transactions]
 *     summary: Realiza um saque em uma conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - valor
 *             properties:
 *               accountId:
 *                 type: string
 *                 example: "1"
 *               valor:
 *                 type: number
 *                 example: 200
 *     responses:
 *       201:
 *         description: Saque realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Erro na requisição
 *       404:
 *         description: Conta não encontrada
 *       500:
 *         description: Saldo insuficiente
 *
 * /transactions/transfer:
 *   post:
 *     tags: [Transactions]
 *     summary: Transfere valores entre duas contas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origemId
 *               - destinoId
 *               - valor
 *             properties:
 *               origemId:
 *                 type: string
 *                 example: "1"
 *               destinoId:
 *                 type: string
 *                 example: "2"
 *               valor:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Transferência realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Erro na requisição
 *       404:
 *         description: Conta não encontrada
 *       500:
 *         description: Saldo insuficiente
 *
 * /transactions/history/{accountId}:
 *   get:
 *     tags: [Transactions]
 *     summary: Lista o histórico de transações de uma conta
 *     parameters:
 *       - in: path
 *         name: accountId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da conta
 *     responses:
 *       200:
 *         description: Histórico de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Conta não encontrada
 */
