import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Action } from 'src/auth/decorators/action.decorator';
import { AuthGuards } from 'src/auth/guards/auth.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuards)
  // Use AuthGuards to Get User State
  @Action('GET_ME')
  async getProfile(@Req() req) {
    const userId = req.user.id;

    const user = await this.usersService.getUserProfile(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  @Action('GET_ALL_USERS')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }
}
