import { Request, Response } from "express";
import { TransactionService } from "../services/transactionService";

const transactionService = new TransactionService();

export class TransactionController {
  deposit = async (req: Request, res: Response) => {
    try {
      const { accountId, valor } = req.body;

      if (!accountId || !valor) {
        res.status(400).json({ error: "id e valor são obrigatórios" });
        return;
      }

      const transaction = await transactionService.deposit(accountId, valor);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  withdraw = async (req: Request, res: Response) => {
    try {
      const { accountId, valor } = req.body;

      if (!accountId || !valor) {
        res.status(400).json({ error: "id e valor são obrigatórios" });
        return;
      }

      const transaction = await transactionService.withdraw(accountId, valor);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  transfer = async (req: Request, res: Response) => {
    try {
      const { origemId, destinoId, valor } = req.body;

      if (!origemId || !destinoId || !valor) {
        res.status(400).json({ error: "conta de origem, valor e conta destino são obrigatórios" });
        return;
      }

      const transaction = await transactionService.transfer(origemId, destinoId, valor);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  history = async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params;

      if (!accountId) {
        res.status(400).json({ error: "id é obrigatório" });
        return;
      }

      const history = await transactionService.getHistory(accountId);
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
