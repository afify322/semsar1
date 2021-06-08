import { IsInt, IsNotEmpty, Length, Max, Min } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'يجب ادخال اسم العميل ' })
  name: string;
  @IsNotEmpty({ message: 'يجب ادخال الرقم القومي' })
  @Length(14,14,{message:'الرقم القومي لا يقل عن 14 رقم'})
  nationalId: string;
  @IsNotEmpty({ message: 'يجب ادخال قيمة الحصة الأسترادية' })
  quotaValue: string;
  @IsNotEmpty({ message: 'يجب ادخال رقم البطاقة الضريبية' })
  taxCardNumber: string;
  taxCardImage: string;
  @IsNotEmpty({ message: 'يجب ادخال رقم بطاقة التأمين' })
  insuranceNumber: string;
  insuranceImage: string;
  @IsNotEmpty({ message: 'يجب ادخال عنوان العميل ' })
  address: string;
  @IsNotEmpty({ message: 'يجب ادخال رقم تليفون العميل' })
  phoneNumber: string;
  nationaIdImage: string;
  @IsNotEmpty({ message: 'يجب ادخال رقم السجل التجاري ' })
  commericalRecord: string;
  commericalRecordImage: string;
  @IsNotEmpty({ message: 'يجب ادخال عنوان السجل التجاري ' })
 addressOfCommericalRecord:string
}
