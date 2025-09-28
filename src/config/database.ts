import { Sequelize } from 'sequelize'
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DB_URL;
if (!databaseUrl) throw new Error("Database url não encontrada");
const sequelize = new Sequelize(databaseUrl);
export { sequelize };