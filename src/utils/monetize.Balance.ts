import { Account } from "../models/Account";
import { sequelize } from "../config/database";

export const monetizeBalances = async (dailyRate: number = 0.01) => {
  try {
    await sequelize.transaction(async (t) => {
      const accounts = await Account.findAll({ transaction: t });

      for (const account of accounts) {
        const currentBalance = account.saldo; 
        const newBalance = currentBalance + currentBalance * dailyRate;

        await account.update({ saldo: newBalance }, { transaction: t });
      }
    });

    console.log("Rendimentos aplicados com sucesso!");
  } catch (error) {
    console.error("Erro ao aplicar rendimentos:", error);
  }
};
