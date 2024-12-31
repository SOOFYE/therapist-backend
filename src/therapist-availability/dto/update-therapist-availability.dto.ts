import { PartialType } from '@nestjs/swagger';
import { CreateTherapistAvailabilityDto } from './create-therapist-availability.dto';

export class UpdateTherapistAvailabilityDto extends PartialType(CreateTherapistAvailabilityDto) {}
