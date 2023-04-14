import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class City_db{
    @Prop()
    city:string
}

export type City_dbDocument=City_db & Document

export const CitySchema=SchemaFactory.createForClass(City_db)