   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import * as mongoose from 'mongoose';
  import { Client } from 'src/client/client.model';
  import { Dealer } from 'src/dealer/dealer.model';
 
  
  export type TransactionsDoc =  mongoose.Document  & Transactions;

  @Schema()
  export class Transactions {
    @Prop({
      ref: Client.name,
      type: mongoose.Schema.Types.ObjectId,
      unique:[true,'العميل قام بعميلة بيع من قبل']
    })
    client: string;
    @Prop({
    })
    dealerName: String;
    @Prop()
    clientName:string
    @Prop()
    phoneNumber:String
    @Prop()
    purchaseCash: number;
    @Prop({ default: Date.now })
    purchaseDate: Date;
    @Prop()
    isExtracted: boolean;
    @Prop()
    relasePaperDate: Date;
    @Prop()
    paperSentToClient: boolean;
    @Prop()
    sentPaperDate: Date;
    @Prop({default:0})
    sellCash: number;
    @Prop({})
    sellDate: Date;
    @Prop()
    paper: string;
    @Prop({default:0})
    profit: number;
    @Prop()
    productType: string;
    
    
  }
  export const TrasnationsSchema = SchemaFactory.createForClass(Transactions);
 