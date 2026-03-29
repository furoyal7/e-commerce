import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Get()
  findAll() {
    return this.usersService.getUsers();
  }
}
