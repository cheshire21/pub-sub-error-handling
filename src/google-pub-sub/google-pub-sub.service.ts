import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, pubsub_v1 } from 'googleapis';
import { PubSubMessageDto } from './dto/google-pub-sub.dto';
import { impersonatingAuth } from './helpers/google.helper';
import { GoogleScope } from './enums/google-scope.enum';
import { PubSub } from '@google-cloud/pubsub';
@Injectable()
export class GooglePubSubService {
  private readonly pubsub: pubsub_v1.Pubsub;
  private readonly project: string;

  constructor(private readonly configService: ConfigService) {
    this.pubsub = google.pubsub({
      version: 'v1',
      auth: impersonatingAuth([
        GoogleScope.cloudPlatformAuth,
        GoogleScope.pubSubAuth,
      ]),
    });

    this.project = this.configService.get('GOOGLE_PROJECT_ID');
  }

  async publishMessage(
    { data, ...message }: PubSubMessageDto,
    topic_id: string,
  ): Promise<string[]> {
    try {
      data = data
        ? Buffer.from(JSON.stringify(data)).toString('base64')
        : undefined;

      const res = await this.pubsub.projects.topics.publish({
        topic: `projects/${this.project}/topics/${topic_id}`,
        requestBody: {
          messages: [{ ...message, data }],
        },
      });

      if (!res.data.messageIds?.length) {
        throw new BadRequestException("message IDs doesn't exist");
      }

      return res.data.messageIds;
    } catch (error: unknown) {
      throw new UnprocessableEntityException(error);
    }
  }

  async change() {
    const pubSubClient = new PubSub({
      credentials: {
        client_email: this.configService.get('GOOGLE_CLIENT_EMAIL'),
        private_key: this.configService.get('GOOGLE_PRIVATE_KEY'),
      },
      projectId: this.configService.get('GOOGLE_PROJECT_ID'),
      scopes: [GoogleScope.cloudPlatformAuth, GoogleScope.pubSubAuth],
    });

    const metadata = {
      deadLetterPolicy: {
        deadLetterTopic: pubSubClient.topic(
          this.configService.get('GOOGLE_PUB_SUB_TOPIC_ID_ERROR'),
        ).name,
        maxDeliveryAttempts: 6,
      },
    };

    const result = await pubSubClient
      .topic(this.configService.get('GOOGLE_PUB_SUB_TOPIC_ID'))
      .subscription('testing-pub-sub-1')
      .setMetadata(metadata);
    console.log('changing subscriptions');
    console.log(JSON.stringify(result, null, 3));

    // const a = await this.pubsub.projects.subscriptions.patch({
    //   name: 'projects/appprueba-cfd7a/subscriptions/testing-pub-sub-1',
    //   requestBody: {
    //     updateMask: 'push_config',
    //     subscription: {
    //       deadLetterPolicy: {
    //         deadLetterTopic:
    //           'projects/appprueba-cfd7a/topics/testing-topic-error',
    //         maxDeliveryAttempts: 6,
    //       },
    //     },
    //   },
    // });

    // console.log(JSON.stringify(a, null, 3));
  }
}
