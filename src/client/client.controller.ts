import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AppointmentEntity } from '../appointment/entities/appointment.entity';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';
import { ClientAppointmentsPaginationDto } from './dto/client-appointment-dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}



}
