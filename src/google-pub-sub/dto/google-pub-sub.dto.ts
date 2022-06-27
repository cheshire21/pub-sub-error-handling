import { Exclude, Expose } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';
import { JsonValue } from '../types/json-value.type';
@Exclude()
export class PubSubMessageDto {
  /**
   * Use data when you want to send complex JSON objects. This must be formated in base64.
   */
  @Expose()
  @IsOptional()
  @IsObject()
  data?: JsonValue | null;

  /**
   * Use attributes to send simple JSON objects
   */
  @Expose()
  @IsOptional()
  @IsObject()
  attributes?: {
    [key: string]: string;
  } | null;
}
