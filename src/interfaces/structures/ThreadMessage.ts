export interface IThreadMessage {
  id?: string;
  content?: string;
  attachments?: any[];
  createdAt?: Date;
  createTimestamp?: number;
  mentions?: Record<string, string>;
  thread?: {
    id?: string;
  };
  author?: {
    id?: string;
  };
}
