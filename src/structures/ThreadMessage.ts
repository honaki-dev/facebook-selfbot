import { Base } from "./Base";
import { Thread } from "./Thread";
import { Client } from "../client/Client";
import { ThreadMember } from "./ThreadMember";
import { MessageDelta, MessageDeltaMention } from "../interfaces/delta/Message";

import type { IThreadMessage } from "../interfaces/structures/ThreadMessage";

export class ThreadMessage extends Base implements IThreadMessage {
  public content?: string;
  public attachments?: any[];
  public createdAt?: Date;
  public createdTimestamp?: number;
  public mentions?: Record<string, string>;
  public thread?: Thread;
  public author?: ThreadMember;

  public constructor(
    client: Client,
    data: MessageDelta,
    thread: Thread,
    author: ThreadMember
  ) {
    super(client);

    this.patch(data, thread, author);
  }

  private parseMentions(data: string | undefined, content: string) {
    if (typeof data !== "string") return {};
    const arr = JSON.parse(data) as MessageDeltaMention[];
    return arr.reduce((obj, data) => {
      obj[data.i] = content.substring(data.o, data.o + data.l);
      return obj;
    }, {} as Record<string, string>);
  }

  public async patch(data: MessageDelta, thread: Thread, author: ThreadMember) {
    this.id = data.messageMetadata.messageId;
    this.content = data.body;
    this.attachments = data.attachments;
    this.createdTimestamp = parseInt(data.messageMetadata.timestamp, 10);
    this.createdAt = new Date(this.createdTimestamp);
    this.mentions = this.parseMentions(data.data?.prng, this.content || "");
    this.author = author;
    this.thread = thread;

    return data;
  }
}
