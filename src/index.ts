import express from "express";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swaggerConfig";

import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes"; 

import { sequelize } from "./config/database";
import { monetizeBalances } from "./utils/monetize.Balance";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2854;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ROTAS DISPONÍVEIS

// rotas do swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs-json", (req, res) => res.json(swaggerSpec));

// rotas de autenticação
app.use("/auth", authRoutes); // /auth/login, /auth/register, /auth/me

// rotas principais de contas
app.use("/accounts", accountRoutes); // /accounts/... CRUD
app.use("/transactions", transactionRoutes); // /transactions/...

// rota health
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AVBank Backend is online",
    timestamp: new Date().toISOString(),
  });
});

// Cron job: Executa todo dia às 23h
cron.schedule("0 23 * * *", async () => {
  console.log("Aplicando rendimento diário (23h)...");
  try {
    await monetizeBalances(0.15); // 15% de rendimento diário
    console.log("Rendimento aplicado com sucesso!");
  } catch (error) {
    console.error("Erro ao aplicar rendimento diário:", error);
  }
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize tested.");

    await sequelize.sync({ alter: true });
    console.log("Postgre sincronizado.");

    app.listen(PORT, () => {
      console.log(
        `AVBank Backend está online na porta ${PORT}\n` +
          `Health check: http://localhost:${PORT}/health\n` +
          `API Docs: http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("unable to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 SIGTERM received, shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});
process.on("SIGINT", async () => {
  console.log("🔄 SIGINT received, shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

startServer();
