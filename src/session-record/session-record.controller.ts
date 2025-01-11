import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Put, Req } from '@nestjs/common';
import { SessionRecordService } from './session-record.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ErrorHttpException } from '../common/errors/error-http.exception';
import { RolesGuard } from '../common/guards/role.guard';
import { SuccessResponse } from '../common/sucesses/success-http.response';
import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard';
import { SessionRecordEntity } from './entities/session-record.entity';
import { SessionRecordStatus } from './enum/session-record.enum';
import { Roles } from '../common/decorators/role.decorator';
import { RoleEnum } from '../user/enums/role.enum';
import { Request } from 'express';

@Controller('session-record')
@ApiBearerAuth()
export class SessionRecordController {
  constructor(private readonly sessionRecordService: SessionRecordService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.therapist)
@Get('/:sessionId')
@ApiOperation({ summary: 'Get session information by session ID' })
@ApiParam({ name: 'sessionId', type: String, description: 'Session Record ID', example: '123e4567-e89b-12d3-a456-426614174000' })
async getSessionInfo(
  @Param('sessionId') sessionId: string,
  @Req() req: Request
): Promise<SuccessResponse<SessionRecordEntity>> {
  try {
    const therapistId = req.user.id;

    // Fetch session record with appointment relation
    const sessionRecord = await this.sessionRecordService.findOne({
      id: sessionId,
    });

    if (!sessionRecord || sessionRecord.appointment.therapist.id !== therapistId) {
      throw new ErrorHttpException(
        HttpStatus.FORBIDDEN,
        'You do not have permission to access this session record.',
        'Forbidden'
      );
    }

    return new SuccessResponse(HttpStatus.OK, 'Session record retrieved successfully.', sessionRecord);
  } catch (error) {
    if (!(error instanceof ErrorHttpException)) {
      throw new ErrorHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Something went wrong while retrieving the session record.',
        'Internal Server Error',
        error.message
      );
    }
    throw error;
  }
}


  
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.therapist)
@Put('/:sessionId/status')
@ApiOperation({ summary: 'Update the status of a session record' })
@ApiParam({ name: 'sessionId', type: String, description: 'Session Record ID', example: '123e4567-e89b-12d3-a456-426614174000' })
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
        example: 'COMPLETED',
      },
    },
  },
})
async updateSessionStatus(
  @Param('sessionId') sessionId: string,
  @Body('status') status: SessionRecordStatus,
  @Req() req: Request
): Promise<SuccessResponse<SessionRecordEntity>> {
  try {
    const therapistId = req.user.id;

    // Fetch session record with appointment relation
    const sessionRecord = await this.sessionRecordService.findOne({
      id: sessionId,
    });

    if (!sessionRecord || sessionRecord.appointment.therapist.id !== therapistId) {
      throw new ErrorHttpException(
        HttpStatus.FORBIDDEN,
        'You do not have permission to update this session record.',
        'Forbidden'
      );
    }

    // Update the session status
    const updatedSessionRecord = await this.sessionRecordService.updateSessionRecord(
      { id: sessionId },
      { status }
    );

    return new SuccessResponse(HttpStatus.OK, 'Session status updated successfully.', updatedSessionRecord);
  } catch (error) {
    if (!(error instanceof ErrorHttpException)) {
      throw new ErrorHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Something went wrong while updating the session status.',
        'Internal Server Error',
        error.message
      );
    }
    throw error;
  }
}


}
