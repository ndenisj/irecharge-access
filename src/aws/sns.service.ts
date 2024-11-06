import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

@Injectable()
export class SNSService {
//   private readonly sns: SNSClient;
  private readonly logger = new Logger(SNSService.name);
//   private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    // this.sns = new SNSClient({
    //   region: this.configService.get<string>('AWS_REGION'),
    //   credentials: {
    //     accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
    //     secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    //   },
    // });
    // this.topicArn = this.configService.get<string>('AWS_SNS_TOPIC_ARN');
  }

  async publishMessage(message: string): Promise<void> {
    // try {
    //   const params: PublishCommandInput = {
    //     TopicArn: this.topicArn,
    //     Message: message,
    //   };

    //   const command = new PublishCommand(params);
    //   await this.sns.send(command);
      this.logger.log(`Message published to SNS successfully with message: ${message}`);
    // } catch (error) {
    //   this.logger.error(`Failed to publish message to SNS: ${error.message}`);
    //   throw error;
    // }
  }
}