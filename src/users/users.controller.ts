import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Action } from 'src/auth/decorators/action.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { AuthGuards } from 'src/auth/guards/auth.guard';

import { UserAction } from './enums/user.action.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuards)
  @Roles(...Object.values(UserRole))
  @Action(UserAction.GET_USER_PROFILE)
  async getProfile(@Req() req) {
    const userId = req.user.id;

    const user = await this.usersService.getUserProfile(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  @Action(UserAction.GET_USERS)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Action(UserAction.GET_USER_BY_ID)
  async findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Post()
  async create(@Body() body: RegisterDto) {
    const { username, email, password, name, roles } = body;

    return await this.usersService.create({
      username,
      email,
      password,
      name,
      roles,
    });
  }
}
