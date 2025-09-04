import { Inject, Injectable, Logger } from '@nestjs/common';
import { CalendlyRepository } from '../repository/calendly.repository';
import { IHttpAdapter } from 'src/lib/adapter/httpAdapterInterface';

@Injectable()
export class DeleteCalendlyInfoService {
  constructor(
    private readonly calendlyRepository: CalendlyRepository,
    @Inject('IHttpAdapter')
    private readonly httpService: IHttpAdapter,
  ) {}

  private readonly logger = new Logger(DeleteCalendlyInfoService.name);

  async execute(mentorId: string) {
    const mentorData = await this.calendlyRepository.getCalendlyInfoByMentorId(
      mentorId,
    );

    if (!mentorData?.calendlyAccessToken || !mentorData?.calendlyUserUuid) {
      throw new Error('Mentor não possui credenciais válidas do Calendly.');
    }

    const accessToken = mentorData.calendlyAccessToken;
    const userUuid = mentorData.calendlyUserUuid;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    let nextPage: string | undefined;

    do {
      const params: any = {
        user: `/users/${userUuid}`,
        status: 'active',
        count: 100,
      };

      if (nextPage) {
        params.page_token = nextPage;
      }

      const res = await this.httpService.callbackGet('/scheduled_events', {
        headers,
        params,
      });

      const events = res.collection || [];
      nextPage = res.pagination?.next_page_token;

      if (events.length === 0) {
        this.logger.log(`Nenhum evento ativo encontrado.`);
      }

      await Promise.all(
        events.map(async (event: any) => {
          const eventUuid = event.uri.split('/').pop();

          try {
            await this.httpService.callbackPost(
              `/scheduled_events/${eventUuid}/cancellation`,
              {
                reason: 'Cancelado automaticamente via sistema.',
              },
              { headers },
            ),
              this.logger.log(`Evento ${eventUuid} cancelado com sucesso.`);
          } catch (err) {
            this.logger.error(
              `Erro ao cancelar evento ${eventUuid}: ${err.message}`,
            );
          }
        }),
      );
    } while (nextPage);
  }
}
