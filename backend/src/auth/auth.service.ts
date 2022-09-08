import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignupUserInput } from './dto/signup-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserInput: SignupUserInput) {
    const user = await this.userRepository.findOne({
      where: [
        { username: createUserInput.username },
        { email: createUserInput.email },
      ],
    });
    if (user) {
      throw new Error('User Already Exists');
    }
    const password = await bcrypt.hash(createUserInput.password, 10);
    const newUser = this.userRepository.create({
      ...createUserInput,
      password,
    });
    return this.userRepository.save(newUser);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    const validPassword = await bcrypt.compare(password, user.password);
    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }
    throw new Error('User not Found');
  }

  async login(user: User) {
    const { password, ...result } = user;
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      user: result,
    };
  }
}
