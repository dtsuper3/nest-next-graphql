import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Query(() => [User], { name: 'users' })
  // @UseGuards(JwtAuthGuard)
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: User) {
    return this.usersService.findOne(user.username);
  }
}
