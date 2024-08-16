import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    if (createUserDto.name === undefined) {
      throw new BadRequestException('Name is required');
    }

    if (createUserDto.email === undefined) {
      throw new BadRequestException('Email is required');
    }

    if (createUserDto.password === undefined) {
      throw new BadRequestException('Password is required');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const record = await this.userRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new BadRequestException(`User #${id} not found`);
    }

    return record;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
