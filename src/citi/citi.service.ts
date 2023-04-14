import { Injectable } from '@nestjs/common';
import { CreateCitiDto } from './dto/create-citi.dto';
import { UpdateCitiDto } from './dto/update-citi.dto';
import { InjectModel } from '@nestjs/mongoose';
import { City_db, City_dbDocument } from './schema/city_db';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import axios from "axios"
import { response } from 'express';




@Injectable()
export class CitiService {
  constructor(@InjectModel(City_db.name) private CityModel:Model<City_dbDocument> , private readonly httpService: HttpService){}
  create(createCitiDto: CreateCitiDto, apiKey: string) : Promise<City_db> {
    if(apiKey==="ABC123"){
      const model=new this.CityModel();
      model.city=createCitiDto.city;
      console.log(model)
      return model.save();
    }
    else{
      return Promise.reject(new Error('fail'))
    }
  }

  findAll() {
    return this.CityModel.find().exec();
  }
  createdcity(createCitiDto: CreateCitiDto) : any {
    const temp=(this.httpService.get(`https://api.openweathermap.org/data/2.5/weather?q=${createCitiDto.city}&appid=c136c9782d5d4c1514591bb3463e56be&units=metric`).pipe(map((response) => response.data.main.temp)));
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

  // async getAllWeatherFromCities(){
  //   let data=[];
  //   let cit =this.findAll().then(city=>{
  //     city.forEach(async ({city})=>{
  //       let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c136c9782d5d4c1514591bb3463e56be`).then((response) => {
  //         console.log(response.data.main.temp);
  //         data.push(response.data.main.temp);

  //       }).catch((err) => console.log(err));
        
  //     })
  //     return data;
  //   });
  //   return data;
    // var data1:number[]=[1.4,2.3];
    //  cit.forEach(async ({city})=>{
    //   let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c136c9782d5d4c1514591bb3463e56be`).then((response) => {
    //     console.log(response.data.main.temp);
    //     data1.push(response.data.main.temp);
       
    //   }).catch((err) => console.log(err));
      
    // })
    // sleep(1000)
    // // const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=c136c9782d5d4c1514591bb3463e56be`);
    // // return data1;
    // return 'fail'
  // }
  async getAllWeatherFromCities() {
    const cities = await this.findAll();
    const promises = cities.map(async ({ city }) => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c136c9782d5d4c1514591bb3463e56be&units=metric`);
        console.log(response.data.main.temp);
        var obj ={
          city : city,
          temp: response.data.main.temp
        }
        return obj
      } catch (err) {
        console.error(err);
        return null;
      }
    });
    const data = await Promise.all(promises);
    return data.filter(temp => temp !== null);
  }
  
}
