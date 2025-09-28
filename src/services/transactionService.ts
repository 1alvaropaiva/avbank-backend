import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { TransactionDTO } from "../dtos/transaction.dto";
import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";

export class TransactionService {
  async deposit(accountId: string, valor: number): Promise<TransactionDTO> {
    const account = await Account.findByPk(accountId);
    if (!account) throw new Error("Conta não encontrada");

    await account.update({ saldo: account.saldo + valor });

    const transaction = await Transaction.create({
      id: uuidv4(),
      tipo: "DEPOSITO",
      valor,
      accountDestinoId: accountId,
    });

    return {
      id: transaction.id,
      tipo: transaction.tipo,
      valor: transaction.valor,
      accountOrigemId: transaction.accountOrigemId,
      accountDestinoId: transaction.accountDestinoId,
    };
  }

  async withdraw(accountId: string, valor: number): Promise<TransactionDTO> {
    const account = await Account.findByPk(accountId);
    if (!account) throw new Error("Conta não encontrada");

    if (account.saldo < valor) throw new Error("Saldo insuficiente");

    await account.update({ saldo: account.saldo - valor });

    const transaction = await Transaction.create({
      id: uuidv4(),
      tipo: "SAQUE",
      valor,
      accountOrigemId: accountId,
    });

    return {
      id: transaction.id,
      tipo: transaction.tipo,
      valor: transaction.valor,
      accountOrigemId: transaction.accountOrigemId,
      accountDestinoId: transaction.accountDestinoId,
    };
  }

  async transfer(origemId: string, destinoId: string, valor: number): Promise<TransactionDTO> {
    if (origemId === destinoId) throw new Error("Não é possível transferir para a mesma conta");

    const [origem, destino] = await Promise.all([
      Account.findByPk(origemId),
      Account.findByPk(destinoId),
    ]);

    if (!origem || !destino) throw new Error("Conta origem ou destino não encontrada");
    if (origem.saldo < valor) throw new Error("Saldo insuficiente");

    await origem.update({ saldo: origem.saldo - valor });
    await destino.update({ saldo: destino.saldo + valor });

    const transaction = await Transaction.create({
      id: uuidv4(),
      tipo: "TRANSFERENCIA",
      valor,
      accountOrigemId: origemId,
      accountDestinoId: destinoId,
    });

    return {
      id: transaction.id,
      tipo: transaction.tipo,
      valor: transaction.valor,
      accountOrigemId: transaction.accountOrigemId,
      accountDestinoId: transaction.accountDestinoId,
    };
  }

  async getHistory(accountId: string): Promise<TransactionDTO[]> {
  const transactions = await Transaction.findAll({
    where: {
      [Op.or]: [{ accountOrigemId: accountId }, { accountDestinoId: accountId }],
    },
    order: [["createdAt", "DESC"]],
  });

  // t já é do tipo transaction 
  return transactions.map((t) => ({
    id: t.id,
    tipo: t.tipo,
    valor: t.valor,
    accountOrigemId: t.accountOrigemId,
    accountDestinoId: t.accountDestinoId,
  }));
  }
}
