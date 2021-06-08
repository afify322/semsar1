import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  client: string;
  @IsOptional()
  @Length(10,30,{message:'اسم العميل يجب ان لا يقل عن 10 حروف ولا يزيد عن 30'})
  dealerName: string;
  @IsNotEmpty({ message: 'يجب ادخال مبلغ الشراء' })
  @Length(1,5,{message:'اقصى مبلغ يمكن ادخاله هو 99,999'})
  purchaseCash: number;
  @IsNotEmpty({ message: 'يجب ادخال تاريخ الشراء' })
  purchaseDate: Date;
  @IsOptional()
  @Length(1,5,{message:'اقصى مبلغ يمكن ادخاله هو 99,999'})
  sellCash: number;
  @IsOptional()
  // تاريخ البيع
  sellDate: Date;
  @IsOptional()
  // الربح
  profit: number;
  @IsOptional()
  //  استخراج الشهاده
  isExtracted: boolean;
  @IsOptional()
  //  تاريخ استلام الشهاده
  relasePaperDate: Date;
  @IsOptional()
  //  استلام العميل للشهاده
  paperSentToClient: boolean;
  @IsOptional()
  //  تاريخ الارسال
  sentPaperDate: Date;
  @IsNotEmpty({ message: 'يجب ادخال الرقم القومي' })
  // الرقم القومي
  @Length(14,14,{message:'الرقم القومي مكون من 14 رقم'})
  nationalId: string;
  @IsOptional()
  // صورة
  paper: string;
  @IsNotEmpty({ message: 'يجب ادخال نوع البضاعة ' })
  productType: string;
  
  @IsOptional()
  clientName:string
  @IsOptional()
  name:string
  @IsOptional()
  @Length(9,11,{message:'رقم التليفون غير صحيح'})
  phoneNumber:string
}
