import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, BeforeInsert, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar', default: '' })
  @ApiProperty()
  password: string;

  // Encriptar contraseña antes de insertar
  @BeforeInsert()
  async hashPassword() {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(this.password, saltOrRounds);
    this.password = hash;
  }
}
