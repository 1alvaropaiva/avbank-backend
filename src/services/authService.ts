import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { Account } from "@/models/Account";
import { AccountService } from "./accountService";

export async function login(login: string, senha: string) {
  const user = await Account.findOne({ where: { login } });
  if (!user) throw new Error("Usuário não encontrado");

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) throw new Error("Senha incorreta");

  const token = generateToken({ id: user.id, login: user.login });

  return {
    token,
    user: {
      id: user.id,
      login: user.login,
      cpf: user.cpf,
      email: user.email,
      saldo: Number(user.saldo), // garante number
    },
  };
}

export async function register(data: any) {
  const accountService = new AccountService();
  const created = await accountService.createAccount({
    login: data.login,
    cpf: (data.cpf || "").replace(/\D/g, ""),
    email: data.email,
    senha: data.senha,
    saldo: data.saldo ?? 0,
  });

  const token = generateToken({ id: created.id, login: created.login });

  return {
    token,
    user: {
      id: created.id,
      login: created.login,
      cpf: created.cpf,
      email: created.email,
      saldo: Number(created.saldo),
    },
  };
}
