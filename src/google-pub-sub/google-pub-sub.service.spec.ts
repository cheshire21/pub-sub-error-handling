import { Test, TestingModule } from '@nestjs/testing';
import { GooglePubSubService } from './google-pub-sub.service';

describe('GooglePubSubService', () => {
  let service: GooglePubSubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GooglePubSubService],
    }).compile();

    service = module.get<GooglePubSubService>(GooglePubSubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
