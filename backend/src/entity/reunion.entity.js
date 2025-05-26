import { EntitySchema } from "typeorm";

const Reunion = new EntitySchema({
    name: "Reunion",
    tableName: "reuniones",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        fecha: {
            type: "timestamp",
            nullable: false,
        },
        acta: {
            type: "varchar",
            length: 255,
            nullable: true,  
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },
});

export default Reunion;
