import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { SearchDto } from 'src/client/dto/search.dto';
import { Client, ClientDoc } from './client.model';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';


@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private client: Model<ClientDoc>) {}
  async create(createClientDto: CreateClientDto) {
    const client = await this.client.findOne({ name: createClientDto.name,nationalId:createClientDto.nationalId });
    if (client) {
      throw new HttpException('هذا العميل موجود', HttpStatus.BAD_REQUEST);
    }
    return new this.client(createClientDto).save();
  }

  async findAll(search: SearchDto,page) {
    if(Object.keys(page).length === 0){
      page.page=1
    }
    const length=await this.client.find().countDocuments()
    const result = await this.client.aggregate([{
      $match:{
      name: { $regex: search.name ?? '', $options: 'i' },
      nationalId: { $regex: search.nationalId ?? '', $options: 'i' },
      taxCardNumber: { $regex: search.taxCardNumber ?? '', $options: 'i' },
      insuranceNumber: { $regex: search.insuranceNumber ?? '', $options: 'i' },
      commericalRecord: {
        $regex: search.commericalRecord ?? '',
        $options: 'i',
      },
      phoneNumber: { $regex: search.phoneNumber ?? '', $options: 'i' },}
    }]).skip((page.page-1)*10).limit(10).exec();
    const endPage=Math.ceil(length/10)
    const pageSize=10
    const totalItems=length
    const startPage=1
    const totalPages=endPage
    var pages=[]

    for(let i=1;i<=endPage;i++){
      pages.push(i)
    }

    return {currentPage:page.page,pageSize,totalItems,startPage,totalPages,pages,pageOfItems:result}
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const result = await this.client.findById(id);
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
  async count() {
    return this.client.count();
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const result = await this.client.findByIdAndUpdate(id, updateClientDto);
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
  async nationalId(id: string) {
    const result = await this.client.findOne({ nationalId: id });
    
    if (!result) {
      throw new HttpException('هذا العميل غير موجود', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const result = await this.client.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);
    }
  }
}
