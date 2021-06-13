import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Express } from 'express';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchDto } from '../transactions/dto/search.dto';
import { imageFileFilter, storage } from 'src/middleware/UploadImage';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/middleware/RolesGuard';
import { Roles } from 'src/middleware/AuthRole';
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','normal')
  @Post()
  @UseInterceptors(
    FileInterceptor('paper', { storage: storage, fileFilter: imageFileFilter }),
  )
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createTransactionDto.paper = file.path;
    }
    return this.transactionsService.create(createTransactionDto);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','normal')
  @Get()
  async findAll(@Query() search: SearchDto,@Query() page) {
  
    return await this.transactionsService.findAll(search,page);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','normal')
  @Get('search')
  async search(@Query() search: SearchDto) {
    return await this.transactionsService.search(search);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','normal')
  @Get('dashboard')
  async dashboard() {
    return await this.transactionsService.dashboard();
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.transactionsService.findOne(id);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','normal')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionsService.update(id, updateTransactionDto);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.transactionsService.remove(id);
  }
}
