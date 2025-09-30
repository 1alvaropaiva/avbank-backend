<h1 style="font-size:50px" align="center">AvBank</h1>

## Descrição
API que simula um sistema bancário simples, capaz de processar depósitos, saques e transferências, além de criar e excluir contas e realizar login/logout.
[Link do desafio](https://docs.google.com/document/d/109Des7J2tU1Gk_Tg8gwvgAsSm2hm1abN8XNAydOZVts/edit?usp=sharing)
e [frontend do projeto](https://github.com/1alvaropaiva/avbank_frontend).

## Sobre a API

- **Principais funcionalidades**
    - Cadastro - Permite criar uma conta, adicionando informações básicas e saldo inicial. 
    - Autenticação - Permite fazer login em uma conta já cadastrada e acessar as funcionalidades básicas.
    - Logout - Permite fazer logout da conta.
    - Extrato - Exibe o histórico de transações da conta (saque, depósito e transferências, com UUID de origem e destino).
    - Saque/depósito - Permite adicionar ou remover qualquer valor da conta bancária. 
    - Transferência entre contas - Permite transferir qualquer valor para uma conta que já exista no banco de dados.
    - Excluir conta - Permite excluir a sua própria conta.
    - Documentação Swagger - Permite consultar os endpoints e suas funcionalidades.

## Executando a aplicação
```BASH
    git clone https://github.com/1alvaropaiva/avbank-backend.git
    cd ./avbank-backend/
    npm install
    npm run dev 
```
Interaja com a aplicação em `http://localhost:(sua porta)`

## Tecnologias utilizadas
- Node
- Typescript
- Express
- Sequelize
- Postgres
- Swagger

## Funções de cada tecnologia

- **Node.js** – Executa o javascript no lado do servidor. Ideal para lidar com múltiplas conexões, e possui muitas bibliotecas.
- **Typescript** – Adiciona tipagem estática ao javascript e auxilia na manutenção e legibilidade do código, e possibilita definir tipagens para basicamente tudo.
- **Express** – Escolhi pela simplicidade de uso e familiaridade com o framework, além de boa integração com as outras tecnologias.
- **Sequelize** - ORM simples e antigo, com boa documentação e projetos para se basear.
- **Postgres** - Escolhi pela integração com o Supabase, porém você pode optar pelo banco da sua escolha (mais informações na seção "Organização do projeto - .env").
- **Swagger** - Documentação e design da API, expõe endpoints de forma interativa e permite testes diretamente na interface gerada, e elimina a necessidade de ferramentas externas, como Postman.

## Organização do projeto
```YAML
avbank-backend
  src
    config
      database.ts
    controllers
      accountController.ts
      authController.ts
      transactionController.ts
    docs
      swaggerConfig.ts
    dtos
      account.dto.ts
      transaction.dto.ts
    middleware
      authMiddleware.ts
    models
      Account.ts
      Transaction.ts
    routes
      accountRoutes.ts
      authRoutes.ts
      transactionRoutes.ts
    services
      accountService.ts
      authService.ts
      transactionService.ts
    utils
      jwt.ts
      monetizeBalance.ts
    index.ts
  .gitignore
  package-lock.json
  package.json
  tsconfig.json
  README.md
```

- **avbank-backend** 
    - **src** - Pasta base do código-fonte da API.
        - **config** - Centraliza configurações compartilhadas.
            - **database.ts** - Cria e exporta a conexão Sequelize com o banco (lê DB_URL via dotenv). Garante que a API fale com o postgre.
        - **controllers** - Camada que recebe a requisição HTTP, valida o básico e orquestra chamadas para os services, retornando as respostas.
            - **accountController.ts** - Endpoints de contas: criação, listagem, atualização, remoção e validação de login. Converte erros em respostas HTTP.
            - **authController.ts** - Endpoints de autenticação: login, registro e perfil (/me). Usa o authService e injeta o usuário decodificado.
            - **transactionController.ts** - Endpoints de transações: depósito, saque, transferência e histórico. Faz validações simples e delega ao service.
        - **docs** - Configura e expõe a documentação da API.
            - **swaggerConfig.ts** - Define o swaggerSpec consumido em /api-docs e /api-docs-json. Mantém os endpoints documentados e testáveis.
        - **dtos** - Tipagens de entrada/saída que padronizam contratos entre camadas.
            - **account.dto.ts** - Define o shape de conta na aplicação, evitando vazamento de campos sensíveis (ex.: senha nos retornos).
            - **transaction.dto.ts** - Define o shape de transação (id, tipo, valor e contas de origem/destino) usado pelos services e controllers.
        - **middleware** - Interceptadores usados nas rotas.
            - **authMiddleware.ts** - Valida Bearer Token JWT (Authorization), injeta o payload em req.user e bloqueia acesso não autenticado.
        - **models** - Modelos Sequelize que refletem as tabelas do banco.
            - **Account.ts** - Modelo de conta com campos (login, cpf, email, senha, saldo). Converte DECIMAL para number no getter de saldo.
            - **Transaction.ts** - Modelo de transação (DEPOSITO/SAQUE/TRANSFERENCIA) e relacionamentos com Account (origem/destino).
        - **routes** - Mapeamento das URLs para controllers.
            - **accountRoutes.ts** - Rotas CRUD de contas: POST/GET/PUT/DELETE em /accounts.
            - **authRoutes.ts** - Rotas de auth: /auth/login, /auth/register e /auth/me (protegida por authMiddleware).
            - **transactionRoutes.ts** - Rotas de transações: /transactions/deposit, /withdraw, /transfer e /history/:accountId.
        - **services** - Camada de regras de negócio e acesso aos modelos.
            - **accountService.ts** - Regras de criação e manutenção de contas (hash de senha com bcrypt, unicidade de CPF/email/login, validações).
            - **authService.ts** - Fluxos de login e registro. Gera token JWT e retorna o usuário autenticado com saldo em number.
            - **transactionService.ts** - Opera saldo e persiste transações com consistência (depósito, saque com verificação de saldo, transferência).
        - **utils** - Utilidades compartilhadas.
           - **jwt.ts** - Wrapper para jsonwebtoken: gerar e validar tokens usando segredo da env.
           - **monetize.Balance.ts** - Aplica rendimento sobre todos os saldos dentro de uma transação do banco; usada pelo cron diário.
        - **index.ts** - Bootstrap do servidor Express: middlewares (helmet, cors, json), rotas, Swagger, healthcheck e cron de rendimento diário.
    - **.env** - Variáveis de ambiente (DB_URL e PORT). É recomendado não versionar o arquivo, porém ele é necessário para a aplicação. Crie um arquivo chamado .env na raiz do projeto e defina a variável PORT com a porta da sua escolha e a variável DB_URL com a URL do seu banco de dados. 
    - **.gitignore** - Define o que o git deve ignorar (ex.: node_modules, .env).
    - **package-lock.json** - Mapa de dependências com versões exatas instaladas.
    - **package.json** - Metadados do projeto, scripts de build/dev e dependências.
    - **tsconfig.json** - Configurações do TypeScript (paths, target, strictness, etc.).
    - **README.md** - Documentação da API, instruções e referências.

## Principais abordagens

- Estratégia de autenticação
  - O usuário se autentica com login e senha. No sucesso, a API retorna um JWT (jsonwebtoken). As rotas protegidas exigem o header Authorization: Bearer <token>. O middleware authMiddleware verifica o token e injeta o payload em req.user.

- Cálculo de rendimento
  - O rendimento é aplicado via utilitário monetizeBalances, que roda dentro de uma transação do banco para garantir consistência. Há um cron diário (node-cron) agendado às 23h em src/index.ts. Essa abordagem evita lógica complexa no banco e mantém o cálculo transparente e reproduzível.

- ORM (Sequelize)
  - Usamos Sequelize para mapear modelos (Account, Transaction) ao PostgreSQL. Isso padroniza CRUD, facilita migrações futuras e melhora a manutenção com TypeScript e autocompletes.

- Documentação (Swagger)
  - swagger-ui-express expõe /api-docs e /api-docs-json, permitindo explorar e testar endpoints de forma interativa durante o desenvolvimento.

- Camadas (Service, Controller e Rota)
  - Service: contém a lógica de negócios e o acesso aos modelos (ex.: validações, hash de senha, regras de saldo e transferências).
  - Controller: recebe HTTP, valida dados mínimos e traduz exceções do service em respostas com status e mensagens apropriadas.
  - Rota: define a URL e método HTTP, conectando ao controller e aplicando middlewares quando necessário.

## Tecnologias auxiliares necessárias

- JSON Web Token (jsonwebtoken) – autenticação stateless com tokens assinado.
- bcrypt – hash seguro de senhas.
- Helmet e CORS – segurança e controle de acesso entre domínios.
- node-cron – agendamento do rendimento diário.
- dotenv – carregamento das variáveis de ambiente.