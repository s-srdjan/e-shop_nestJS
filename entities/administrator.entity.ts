import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_administrator_username", ["username"], { unique: true })
@Entity("administrator")
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column("varchar", {
    unique: true,
    length: 32,
  })
  username: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
  })
  passwordHash: string;
}
