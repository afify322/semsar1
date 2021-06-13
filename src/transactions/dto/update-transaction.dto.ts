import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto {
  @IsNotEmpty({ message: 'يجب ادخال مبلغ البيع' })

  sellCash: number;
  @IsNotEmpty({ message: 'يجب ادخال تاريخ البيع' })
  sellDate: Date;

  @IsNotEmpty({ message: 'يجب ادخال اسم التاجر' })
  dealerName: string;
  @IsNotEmpty({ message: 'يجب ادخال رقم التليفون ' })
  @Length(8,11,{message:'رقم التليفون غير صحيح'})
  phoneNumber: string;
}
