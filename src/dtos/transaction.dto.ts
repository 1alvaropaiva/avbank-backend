export class TransactionDTO {
  id!: string;
  tipo!: "DEPOSITO" | "SAQUE" | "TRANSFERENCIA";
  valor!: number;
  accountOrigemId?: string | null;
  accountDestinoId?: string | null;
}
