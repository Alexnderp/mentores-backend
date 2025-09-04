import { forwardRef, Module } from '@nestjs/common';
import { CalendlyController } from './calendly.controller';
import { OAuthCallbackService } from './services/calendly-callback.service';
import { InitiateOAuthService } from './services/calendlyOAuth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { FetchSchedulesService } from './services/fetch-schedules.service';
import { PrismaService } from 'prisma/service/prisma.service';
import { CalendlyRepository } from './repository/calendly.repository';
import { JwtService } from '@nestjs/jwt';
import { CreateCalendlyInfoService } from './services/create-calendly-info.service';
import { UpdateCalendlyInfoService } from './services/update-calendly-info.service';
import { GetCalendlyMentorInfoService } from './services/get-calendly-mentor-info.service';
import { PassportModule } from '@nestjs/passport';
import HttpAdapter from '../../lib/adapter/httpAdapter';
import { GetAllCalendlyMentorInfosService } from './services/get-all-calendly-mentor-infos.service';
import { DeleteCalendlyInfoService } from './services/delete-calendly-info.service';
import { MentorModule } from '../mentors/mentor.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => MentorModule),
  ],
  controllers: [CalendlyController],
  providers: [
    OAuthCallbackService,
    InitiateOAuthService,
    RefreshTokenService,
    FetchSchedulesService,
    CreateCalendlyInfoService,
    UpdateCalendlyInfoService,
    GetCalendlyMentorInfoService,
    GetAllCalendlyMentorInfosService,
    CalendlyRepository,
    PrismaService,
    JwtService,
    DeleteCalendlyInfoService,
    {
      provide: 'IHttpAdapter',
      useClass: HttpAdapter,
    },
  ],

  exports: [CalendlyRepository, DeleteCalendlyInfoService],
})
export class CalendlyModule {}
