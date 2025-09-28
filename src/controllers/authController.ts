import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function login(req: Request, res: Response) {
  try {
    const { login, senha } = req.body;
    const result = await authService.login(login, senha);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const decoded = (req as any).user as { id: string };
    if (!decoded?.id) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    // Busca o usuário completo no banco para garantir shape e saldo numérico
    const { Account } = await import("@/models/Account");
    const account = await Account.findByPk(decoded.id);
    if (!account) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const user = {
      id: account.id,
      login: account.login,
      cpf: account.cpf,
      email: account.email,
      saldo: Number(account.saldo),
    };

    res.json({ user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
