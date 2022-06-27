import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GooglePubSubService } from './google-pub-sub.service';

@Module({
  imports: [ConfigModule],
  providers: [GooglePubSubService],
  exports: [GooglePubSubService],
})
export class GooglePubSubModule {}
