import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCitiDto } from './dto/create-citi.dto';
import { UpdateCitiDto } from './dto/update-citi.dto';
import { InjectModel } from '@nestjs/mongoose';
import { City_db, City_dbDocument } from './schema/City_db';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import axios from "axios";
import { response } from 'express';
import { BasicStrategy as Strategy } from 'passport-http';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import redis from "redis";
import { Socket } from 'dgram';
import * as dotenv from 'dotenv';
import Redis from "ioredis";
import { promises } from 'dns';

@Injectable()
export class CitiService {
  private readonly API_KEYS: String
  constructor(@InjectModel(City_db.name) private CityModel: Model<City_dbDocument>, private readonly httpService: HttpService) {
    dotenv.config();
    this.API_KEYS = process.env.API_KEYS;
  }
  // create(createCitiDto: CreateCitiDto) : Promise<City_db> {

  //     const model=new this.CityModel();
  //     model.city=createCitiDto.city;
  //     console.log(model)
  //     return model.save();


  // }
  // async create(createCitiDto: CreateCitiDto): Promise<City_db> {
  //   const { city } = createCitiDto;

  //   const filter = { city: city };
  //   const update = { city: city };
  //   const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  //   try {
  //     const result = await this.CityModel.findOneAndUpdate(filter, update, options);
  //     return result;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }


  async create(createCitiDto: CreateCitiDto): Promise<City_db> {
    const redis = new Redis();
    redis.expire('city',1)
    const existingCity = await this.CityModel.findOne({ city: createCitiDto.city });

    if (existingCity) {
      console.log("hdhshbd")
      throw new HttpException('City already exists', HttpStatus.CONFLICT);
    }

    const model = new this.CityModel(createCitiDto);
    return model.save();
  }
  // async findAll()  {
  //   const redis=require("redis")
  //   const redisClient=await redis.createClient(
  //   //   {
  //   //     password:'Pehh8g3JQpKvScMz3DcLOuLJTddPbOep',

  //   //   socket:{
  //   //     host:"redis-18083.c305.ap-south-1-1.ec2.cloud.redislabs.com",
  //   //     port:18083
  //   //   }
  //   // }
  //   );
  //   // await redisClient.connect();

  //   // redisClient.get('city', async (error, city)  => {
  //   //   if(error){
  //   //    console.error(error)
  //   //    }
  //   //   if(city!=null){
  //   //     console.log("Hii")
  //   //    return (JSON.parse(city))
  //   //   }
  //   //   else{
  //   //     console.log("B")
  //   //   let data=this.CityModel.find().exec();
  //   // redisClient.setEx('city',3660,JSON.stringify(data))
  //   // return await this.CityModel.find().exec();
  //   //    }

  //   //  } 
  //   // )
  //   redisClient.on("error", function(error) {
  //     console.error("Error connecting to Redis:", error);
  //   });

  //   redisClient.on("ready", function() {
  //     console.log("Successfully connected to Redis");
  //     redisClient.get('city', (error, city) => {
  //       if (error) {
  //         console.error("Error getting city from Redis:", error);
  //       }
  //       if (city != null) {
  //         console.log("City found in Redis cache");
  //         return JSON.parse(city);
  //       } else {
  //         console.log("City not found in Redis cache");
  //         let data = this.CityModel.find().exec();
  //         redisClient.setEx('city', 3660, JSON.stringify(data));
  //         return data;
  //       }
  //     });
  //   });



  // }
  async findAll() {

    const redis = new Redis();

    return await this.CityModel.find().exec();
    // redis.set("city", JSON.stringify(cities)); 
    // redis.get("city", (err, result) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log(result); // Prints "value"
    //   }
    // });


    // redisClient.on("end", function() {
    //   console.log("Connection to Redis ended");
    // });

    // redisClient.on("reconnecting", function() {
    //   console.log("Reconnecting to Redis...");
    // });

    // redisClient.on("warning", function(warning) {
    //   console.warn("Redis warning:", warning);
    // });

    console.log("Connecting to Redis...");
  }

  createdcity(createCitiDto: CreateCitiDto): any {
    const temp = (this.httpService.get(`https://api.openweathermap.org/data/2.5/weather?q=${createCitiDto.city}&appid=${this.API_KEYS}&units=metric`).pipe(map((response) => response.data.main.temp)));
    return temp;
  }
  findOne(id: number) {
    return `This action returns a #${id} citi`;
  }

  update(id: number, updateCitiDto: UpdateCitiDto) {
    return `This action updates a #${id} citi`;
  }

  remove(id: number) {
    return `This action removes a #${id} citi`;
  }
   sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  async getAllWeatherFromCities() {
    const redis = new Redis();
    const res= await redis.get("city", async (err, city) => {
      if (err) {
        console.log("error aaya");
      }
      if (city != null) {
        //console.log("redis",city)
        return await JSON.parse(city)
        console.log("Hii")


      }
      else {
        const cities = await this.CityModel.find().exec();
        const promises = cities.map(async ({ city }) => {
          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEYS}&units=metric`);
            //console.log(response.data.main.temp);
            var obj = {
              city: city,
              temp: response.data.main.temp
            }
            // console.log(obj)
            return obj
          } catch (err) {
            console.log(err);
             return "error"
          }
        });
        const data = await Promise.all(promises);
        console.log("mongo",data);
        redis.set("city", JSON.stringify(data));
        
        return data
      

      }

      
    }
    )
    if(res===null){
      const cities = await this.CityModel.find().exec();
      const promises = cities.map(async ({ city }) => {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEYS}&units=metric`);
          //console.log(response.data.main.temp);
          var obj = {
            city: city,
            temp: response.data.main.temp
          }
          // console.log(obj)
          return obj
        } catch (err) {
          console.log(err);
           return "error"
        }
      });
      const data = await Promise.all(promises);
      //console.log("mongo",data);
      redis.set("city", JSON.stringify(data))
      
      
      return data
    

    }
    else{
      return res
    }
    }


  }
  

