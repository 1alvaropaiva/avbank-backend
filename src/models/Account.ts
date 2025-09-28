import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelize } from "../config/database";

export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: string;
  declare login: string;
  declare cpf: string;
  declare email: string;
  declare senha: string;
  declare saldo: number;
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    login: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    saldo: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue("saldo");
        return rawValue === null ? 0 : parseFloat(rawValue as unknown as string);
      },
    },
  },
  {
    sequelize,
    tableName: "accounts",
    timestamps: true,
  }
);
