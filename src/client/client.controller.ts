import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AppointmentEntity } from '../appointment/entities/appointment.entity';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';
import { ClientAppointmentsPaginationDto } from './dto/client-appointment-dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}



  
  @Get(':clientId/appointments')
  @ApiOperation({ summary: 'Fetch all appointments for a client (paginated)' })
  @ApiParam({ name: 'clientId', description: 'ID of the client' })
  async getClientAppointments(
    @Param('clientId') clientId: string,
    @Query() paginationDto: ClientAppointmentsPaginationDto,
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const { page, limit } = paginationDto;
    return this.clientService.getClientAppointments(clientId, page, limit);
  }


}
