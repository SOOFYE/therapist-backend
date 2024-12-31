import { PartialType } from '@nestjs/swagger';
import { CreateTherapistServiceDto } from './create-therapist-service.dto';

export class UpdateTherapistServiceDto extends PartialType(CreateTherapistServiceDto) {}
