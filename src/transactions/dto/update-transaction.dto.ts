import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNotEmpty({ message: 'يجب ادخال مبلغ البيع' })
  @Length(1,5,{message:'اقصى مبلغ يمكن ادخاله هو 99,999'})
  sellCash: number;
  @IsNotEmpty({ message: 'يجب ادخال تاريخ البيع' })
  sellDate: Date;
  @IsNotEmpty({ message: 'يجب ادخال مبلغ الشراء' })
  dealer: string;
  @IsNotEmpty({ message: 'يجب ادخال اسم التاجر' })
  name: string;
  @IsNotEmpty({ message: 'يجب ادخال رقم التليفون ' })
  @Length(9,11,{message:'رقم التليفون غير صحيح'})
  phoneNumber: string;
}
