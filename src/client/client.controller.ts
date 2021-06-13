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
  UploadedFiles,
  HttpException,
  HttpStatus,
  Query,
  Put,
  UseGuards
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, storage } from 'src/middleware/UploadImage';
import { SearchDto } from 'src/client/dto/search.dto';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { FilesDto } from './dto/files.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { RolesGuard } from 'src/middleware/RolesGuard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/middleware/AuthRole';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Roles('admin','normal')
  @Post()
   @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'nationaIdImage', maxCount: 1 },
        { name: 'taxCardImage', maxCount: 1 },
        { name: 'insuranceImage', maxCount: 1 },
        { name: 'commericalRecordImage', maxCount: 1 },
      ],
      { storage: storage, fileFilter: imageFileFilter },
    ),
  ) 
  async create(
    @Body() createClientDto: CreateClientDto, 
    @UploadedFiles() files: FilesDto,
  ) {
  
     JSON.parse(JSON.stringify(files));

    if (
      files.nationaIdImage &&
      files.taxCardImage &&
      files.insuranceImage &&
      files.commericalRecordImage
    ) {
      createClientDto.nationaIdImage = `${files.nationaIdImage[0].path}`;
      createClientDto.taxCardImage = `${files.taxCardImage[0].path}`;
      createClientDto.insuranceImage = `${files.insuranceImage[0].path}`;
      createClientDto.commericalRecordImage = `${files.commericalRecordImage[0].path}`;
      return this.clientService.create(createClientDto);
    } else { 
      throw new HttpException('يجب ادخال صورة الرقم القومي وصورة السجل التاجري وصورة البطاقة الضريبية وصورة بطاقة التأمين',HttpStatus.BAD_REQUEST)    }
  }
  @Roles('admin','normal')
  @Get()
  async findAll(@Query() search: SearchDto,@Query() page) {
    return await this.clientService.findAll(search,page);
  }
  @Roles('admin','normal')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.clientService.findOne(id);
  }
  @Roles('admin')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientService.update(id, updateClientDto);
  }
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.clientService.remove(id);
  }
}


