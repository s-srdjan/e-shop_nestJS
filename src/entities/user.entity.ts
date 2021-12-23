import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";

@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_phone_number", ["phoneNumber"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", {
    unique: true,
    length: 255,
  })
  email: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
  })
  passwordHash: string;

  @Column("varchar", {length: 64})
  forename: string;

  @Column("varchar", { length: 64 })
  surname: string;

  @Column("varchar", {
    name: "phone_number",
    unique: true,
    length: 24,
  })
  phoneNumber: string;

  @Column("text", { name: "postal_address" })
  postalAddress: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
