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
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/middleware/AuthRole';
import { RolesGuard } from 'src/middleware/RolesGuard';
import { DealerService } from './dealer.service';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';
@UseGuards(AuthGuard(), RolesGuard)
@Controller('dealer')
export class DealerController {
  constructor(private readonly dealerService: DealerService) {}
  @Roles('admin','normal')
  @Post()
  create(@Body() createDealerDto: CreateDealerDto) {
    return this.dealerService.create(createDealerDto);
  }
  @Roles('admin','normal')
  @Get()
  async findAll() {
    return await this.dealerService.findAll();
  }
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dealerService.findOne(id);
  }
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDealerDto: UpdateDealerDto,
  ) {
    return await this.dealerService.update(id, updateDealerDto);
  }
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dealerService.remove(id);
  }
}
