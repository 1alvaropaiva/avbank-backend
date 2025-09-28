import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelize } from "../config/database";
import { Account } from "./Account";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: string;
  declare tipo: "DEPOSITO" | "SAQUE" | "TRANSFERENCIA";
  declare valor: number;
  declare accountOrigemId: string | null;
  declare accountDestinoId: string | null;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.ENUM("DEPOSITO", "SAQUE", "TRANSFERENCIA"),
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("valor");
        return rawValue === null ? 0 : parseFloat(rawValue as unknown as string);
      },
    },
    accountOrigemId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    accountDestinoId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
  }
);

// relacionamentos
Transaction.belongsTo(Account, { as: "origem", foreignKey: "accountOrigemId" });
Transaction.belongsTo(Account, { as: "destino", foreignKey: "accountDestinoId" });
