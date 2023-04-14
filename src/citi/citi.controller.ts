import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CitiService } from './citi.service';
import { CreateCitiDto } from './dto/create-citi.dto';
import { UpdateCitiDto } from './dto/update-citi.dto';

@Controller('citi')
export class CitiController {
  constructor(private readonly citiService: CitiService) {}

  @Post()
  create(@Query('apiKey') apiKey: string,@Body() createCitiDto: CreateCitiDto) {
    return this.citiService.create(createCitiDto,apiKey);
  }


  @Get()
  findAll() {
    return this.citiService.findAll();
  }

  @Post("name")
  createdcity(@Body() createCitiDto: CreateCitiDto) {

    return this.citiService.createdcity(createCitiDto);
  }
  @Get("getAll")
  getAllWeatherFromCities() {
    return this.citiService.getAllWeatherFromCities();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitiDto: UpdateCitiDto) {
    return this.citiService.update(+id, updateCitiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citiService.remove(+id);
  }
}
