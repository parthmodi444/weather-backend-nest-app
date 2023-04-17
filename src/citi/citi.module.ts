import { Module } from '@nestjs/common';
import { CitiService } from './citi.service';
import { CitiController } from './citi.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CitySchema, City_db } from './schema/City_db';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{name:City_db.name,schema:CitySchema}]),HttpModule,    ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:".env"
  }),],
  controllers: [CitiController],
  providers: [CitiService]
})
export class CitiModule {}
