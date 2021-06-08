import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/middleware/RolesGuard';
import { Roles } from 'src/middleware/AuthRole';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  async login(@Body() loginDto: loginDto) {
    console.log(loginDto);
    return await this.userService.login(loginDto);
  }
  
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

 
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @Patch('lock')
  async lockUser(@Param() id: string, @Body() lock: boolean) {
    return await this.userService.lockUser(id, lock);
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
