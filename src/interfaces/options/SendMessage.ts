export interface SendMessageOptions {
  content: string;
  attachments: any[];
}

export type SendMessagePayload = SendMessageOptions | string;
