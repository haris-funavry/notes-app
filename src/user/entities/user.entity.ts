import {
  AutoIncrement,
  BeforeCreate,
  BeforeSave,
  Column,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { hash } from 'bcrypt';

@Table({ paranoid: true })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false })
  name: string;

  @IsEmail
  @Column({ allowNull: false, unique: true })
  email: string;

  @Column
  password: string;

  @BeforeCreate
  static async hashPassword(instance: User) {
    instance.password = await hash(
      instance.password,
      parseInt(process.env.HASH_SALT_ROUNDS),
    );
  }
}
