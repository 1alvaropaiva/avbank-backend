import { Request, Response } from "express";
import { AccountService } from "../services/accountService";

export class AccountController {
  private accountService = new AccountService();

  createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { login, cpf, email, senha, saldo } = req.body;

      if (!login || !cpf || !email || !senha || saldo === undefined) {
        res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
        return;
      }

      const newAccount = await this.accountService.createAccount({
        login,
        cpf: cpf.replace(/\D/g, ""),
        email,
        senha,
        saldo,
      });

      res.status(201).json({ success: true, message: "Conta criada com sucesso", data: newAccount });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Erro interno" });
    }
  };

  getAllAccounts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const accounts = await this.accountService.getAllAccounts();
      res.status(200).json({ success: true, data: accounts, total: accounts.length });
    } catch (error) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Erro interno" });
    }
  };

  updateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({ success: false, message: "ID é obrigatório" });
        return;
      }

      const updatedAccount = await this.accountService.updateAccount(id, updateData);

      if (!updatedAccount) {
        res.status(404).json({ success: false, message: "Conta não encontrada" });
        return;
      }

      res.status(200).json({ success: true, message: "Conta atualizada", data: updatedAccount });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Erro interno" });
    }
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ success: false, message: "ID é obrigatório" });
        return;
      }

      const deleted = await this.accountService.deleteAccount(id);

      if (!deleted) {
        res.status(404).json({ success: false, message: "Conta não encontrada" });
        return;
      }

      res.status(200).json({ success: true, message: "Conta deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Erro interno" });
    }
  };

  validateLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        res.status(400).json({ success: false, message: "Login e senha obrigatórios" });
        return;
      }

      const account = await this.accountService.validateLogin(login, senha);

      if (!account) {
        res.status(401).json({ success: false, message: "Credenciais inválidas" });
        return;
      }

      res.status(200).json({ success: true, message: "Login válido", data: account });
    } catch (error) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Erro interno" });
    }
  };
}
