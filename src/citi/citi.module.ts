import { Module } from '@nestjs/common';
import { CitiService } from './citi.service';
import { CitiController } from './citi.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CitySchema, City_db } from './schema/city_db';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MongooseModule.forFeature([{name:City_db.name,schema:CitySchema}]),HttpModule],
  controllers: [CitiController],
  providers: [CitiService]
})
export class CitiModule {}
