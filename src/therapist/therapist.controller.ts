import { Controller, Body, Param, Put } from '@nestjs/common';
import { TherapistService } from './therapist.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TherapistEntity } from './entities/therapist.entity';

@ApiTags('Therapist')
@Controller('therapist')
export class TherapistController {
  constructor(private readonly therapistService: TherapistService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update therapist details' })
  async updateTherapist(
    @Param('id') id: string,
    @Body() updateData: Partial<TherapistEntity>,
  ): Promise<TherapistEntity> {
    return this.therapistService.updateTherapist(id, updateData);
  }
}
