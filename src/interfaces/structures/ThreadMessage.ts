import { Thread } from "../../structures/Thread";
import { ThreadMember } from "../../structures/ThreadMember";

export interface IThreadMessage {
  id?: string;
  content?: string;
  attachments?: any[];
  createdAt?: Date;
  createTimestamp?: number;
  mentions?: Record<string, string>;
  thread?: Thread;
  author?: ThreadMember;
}
