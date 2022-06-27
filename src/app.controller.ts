import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { GooglePubSubService } from './google-pub-sub/google-pub-sub.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pubSubService: GooglePubSubService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // to change dead letting
  @Post('change')
  change() {
    return this.pubSubService.change();
  }

  @Post('/receiver')
  // @HttpCode(500)
  webhookmanager() {
    console.log('receiver fail');
    this.webhookComponent();
  }

  @Post('create-message')
  createMessage() {
    return this.pubSubService.publishMessage(
      {
        attributes: {
          foo: 'hello world',
        },
      },
      this.configService.get('GOOGLE_PUB_SUB_TOPIC_ID'),
    );
  }

  @Post('error-handler')
  errorHandler() {
    try {
      this.webhookComponent(); // executed at 6th attempt
    } catch (e) {
      console.log('Sending to Logger');
      console.log(e);
    }
  }

  //could a webhookManagerCoponent or EventListener
  webhookComponent() {
    throw new BadRequestException('hola :v');
  }
}
