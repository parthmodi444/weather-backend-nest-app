import { PartialType } from '@nestjs/mapped-types';
import { CreateCitiDto } from './create-citi.dto';

export class UpdateCitiDto extends PartialType(CreateCitiDto) {}
