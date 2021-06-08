import { IsOptional } from 'class-validator';

export class SearchDto {
  @IsOptional()
  nationalId: string;
  @IsOptional()
  purchaseCash: number;
  @IsOptional()
  purchaseDate: Date;
  @IsOptional()
  clientName: string;
  @IsOptional()
  client: string;
  @IsOptional()
  dealerName: string;

}
