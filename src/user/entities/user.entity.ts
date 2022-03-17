import {
  AutoIncrement,
  BeforeCreate,
  Column,
  HasMany,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { hash } from 'bcrypt';
import { Note } from 'src/note/entities/note.entity';

@Table({
  paranoid: true,
  // exclude following fields in select statements
  defaultScope: { attributes: { exclude: ['password'] } },
})
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

  @HasMany(() => Note, { onDelete: 'cascade' })
  notes: Note[];

  @BeforeCreate
  static async hashPassword(instance: User) {
    instance.password = await hash(
      instance.password,
      parseInt(process.env.HASH_SALT_ROUNDS),
    );
  }
}
