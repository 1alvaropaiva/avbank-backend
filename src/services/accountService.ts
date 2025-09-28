import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Account } from "../models/Account";
import { AccountDTO } from "../dtos/account.dto";

export class AccountService {
  async createAccount(accountData: Omit<AccountDTO, "id">): Promise<AccountDTO> {
    if (accountData.saldo === undefined || accountData.saldo < 0) {
      throw new Error("Saldo inicial deve ser informado e não pode ser negativo");
    }

    if (accountData.cpf.length !== 11) {
      throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    const [existingCpf, existingEmail, existingLogin] = await Promise.all([
      Account.findOne({ where: { cpf: accountData.cpf } }),
      Account.findOne({ where: { email: accountData.email } }),
      Account.findOne({ where: { login: accountData.login } }),
    ]);

    if (existingCpf) throw new Error("CPF já cadastrado");
    if (existingEmail) throw new Error("Email já cadastrado");
    if (existingLogin) throw new Error("Login já está em uso");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(accountData.email)) {
      throw new Error("Email deve ser um endereço válido");
    }

    const hashedPassword = await bcrypt.hash(accountData.senha, 12);

    const newAccount = await Account.create({
      id: uuidv4(),
      login: accountData.login,
      cpf: accountData.cpf,
      email: accountData.email,
      senha: hashedPassword,
      saldo: accountData.saldo,
    });

    return {
      id: newAccount.id,
      login: newAccount.login,
      cpf: newAccount.cpf,
      email: newAccount.email,
      saldo: newAccount.saldo,
      senha: "",
    };
  }

  async getAccountById(id: string): Promise<AccountDTO | null> {
    const account = await Account.findByPk(id);
    if (!account) return null;

    return {
      id: account.id,
      login: account.login,
      cpf: account.cpf,
      email: account.email,
      saldo: account.saldo,
      senha: "",
    };
  }

  async getAccountByCpf(cpf: string): Promise<AccountDTO | null> {
    const account = await Account.findOne({ where: { cpf } });
    if (!account) return null;

    return {
      id: account.id,
      login: account.login,
      cpf: account.cpf,
      email: account.email,
      saldo: account.saldo,
      senha: "",
    };
  }

  async getAllAccounts(): Promise<AccountDTO[]> {
    const accounts = await Account.findAll();
    return accounts.map((acc: { id: any; login: any; cpf: any; email: any; saldo: any; }) => ({
      id: acc.id,
      login: acc.login,
      cpf: acc.cpf,
      email: acc.email,
      saldo: acc.saldo,
      senha: "",
    }));
  }

  async updateAccount(
    id: string,
    updateData: Partial<Omit<AccountDTO, "id">>
  ): Promise<AccountDTO | null> {
    const account = await Account.findByPk(id);
    if (!account) return null;

    if (updateData.saldo !== undefined && updateData.saldo < 0) {
      throw new Error("Saldo não pode ser negativo");
    }

    if (updateData.senha) {
      updateData.senha = await bcrypt.hash(updateData.senha, 12);
    }

    await account.update(updateData);
    await account.reload();

    return {
      id: account.id,
      login: account.login,
      cpf: account.cpf,
      email: account.email,
      saldo: account.saldo,
      senha: "",
    };
  }

  async deleteAccount(id: string): Promise<boolean> {
    const account = await Account.findByPk(id);
    if (!account) return false;
    await account.destroy();
    return true;
  }

  async validateLogin(login: string, senha: string): Promise<AccountDTO | null> {
    const account = await Account.findOne({ where: { login } });
    if (!account) return null;

    const isValidPassword = await bcrypt.compare(senha, account.senha);
    if (!isValidPassword) return null;

    return {
      id: account.id,
      login: account.login,
      cpf: account.cpf,
      email: account.email,
      saldo: account.saldo,
      senha: "",
    };
  }
}
