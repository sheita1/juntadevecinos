"use strict";
import { EntitySchema } from "typeorm";

const VecinoSchema = new EntitySchema({
  name: "Vecino",
  tableName: "vecinos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    correo: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    comprobanteDomicilio: {
      type: "varchar",
      length: 255,  
      nullable: true,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_VECINO",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_VECINO_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_VECINO_CORREO",
      columns: ["correo"],
      unique: true,
    },
  ],
});

export default VecinoSchema;
