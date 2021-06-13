import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientService } from 'src/client/client.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { SearchDto } from '../transactions/dto/search.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {  Transactions, TransactionsDoc } from './transactions.model';
import { DealerService } from 'src/dealer/dealer.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transactions.name) private trans: Model<TransactionsDoc>,
    private client: ClientService,
    private dealer: DealerService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const client = await this.client.nationalId(
      createTransactionDto.nationalId
    );    
    const n=await this.trans.findOne({client:client._id})
    if(n){
      throw new HttpException('هذا العميل قام بعملية بيع سابقا',HttpStatus.BAD_REQUEST)
    }
    const {dealerName,sellCash,sellDate,phoneNumber}=createTransactionDto

    if(dealerName && sellCash && sellDate && phoneNumber){
      const dealer = await this.dealer.findByname(dealerName);
      const profit = +sellCash - +createTransactionDto.purchaseCash;
      const dealerObj={name:dealerName,phoneNumber:phoneNumber}
      createTransactionDto.profit=profit
      if (dealer) {
        createTransactionDto.dealerName=dealer.name
        createTransactionDto.phoneNumber=dealer.phoneNumber
        createTransactionDto.client = client._id;

        return await (await new this.trans(createTransactionDto).save()).populate('client').execPopulate()
        
              }
      const tempdealer=await this.dealer.create(dealerObj);
      createTransactionDto.dealerName=tempdealer.name

    }
    delete createTransactionDto.name
    delete createTransactionDto.sellCash
    delete createTransactionDto.sellDate
    
    createTransactionDto.client = client._id;

    return await (await new this.trans(createTransactionDto).save()).populate('client').execPopulate()

  }
  async findAll(search: SearchDto,page) {
    if(Object.keys(page).length === 0){
      page.page=1
    }
    const length=await this.trans.find().countDocuments();
  let result=await this.trans.aggregate([
    {
      $lookup: {
        from: 'clients',
        localField: 'client',
        foreignField: '_id',
        as: 'client',
      },
    },
     {
      $match:{'client.nationalId':{$regex:search.nationalId ?? '',$options:'i'}
    ,'client.name':{$regex:search.clientName ?? '',$options:'i'}
    ,'dealerName':{$regex:search.dealerName ?? '',$options:'i'}}
    } 
  ]).skip((page.page-1)*10).limit(10).exec(); 
  result.forEach(element => {
    element.client=element.client[0]
  });
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
  async search(search: SearchDto) {
    if (search.nationalId) {
      const client = await this.client.nationalId(search.nationalId);
      search.client = client._id;
      delete search.nationalId;
    }
    return this.trans.find(search);
  }

  findOne(id: string) {
    return this.trans.findById(id);
  }
  async dashboard() {
    //profits
    const profit = await this.trans.find();
    const totalprofit = profit.map((data) => {
      return data.profit;
    });
    const total = totalprofit.reduce((acc, val) => {
      return +acc + +val;
    }, 0);
    //income
    const income = await this.trans.find();
    const totalincome = income.map((data) => {
      return data.sellCash;
    });
    const totalin = totalincome.reduce((acc, val) => {
      return +acc + +val;
    }, 0);
    //outcome
    const outcome = await this.trans.find({})
    const totaloutcome = outcome.map((data) => {
      return data.purchaseCash;
    });
    const totalout = totaloutcome.reduce((acc, val) => {
      return +acc + +val;
    }, 0);

    const result = await Promise.all([
      this.client.count(),
      this.dealer.count(),
      this.trans.count(),
    ]);
    return {
      totlaOutcome: totalout,
      totalIncome: totalin,
      profit: total,
      clients: result[0],
      dealers: result[1],
      transactions: result[2],
      qoutaNumber: result[0],
    };
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const sell = +updateTransactionDto.sellCash;

    const result = await this.trans.findOneAndUpdate(
      { _id: id },
      updateTransactionDto,
      { new: true },
    );
    const profit = sell - +result.purchaseCash;
    const dealerObj = {
      name: updateTransactionDto.dealerName,
      phoneNumber: updateTransactionDto.phoneNumber,
    };
    const dealer = await this.dealer.findByname(dealerObj.name);
    if (dealer) {
      return await this.trans.findOneAndUpdate(
        { _id: id },
        { profit: profit,dealer:dealer._id },
        { new: true },
      );
    }

    await this.dealer.create(dealerObj);
    return this.trans.findOneAndUpdate(
      { _id: id },
      { profit: profit,dealer:dealer._id },
      { new: true },
    );
  }

  remove(id: string) {
    return this.trans.findByIdAndDelete(id);
  }
}
