import { Base } from "./Base";
import { Client } from "../client/Client";
import { MessageDelta, MessageDeltaMention } from "../interfaces/delta/Message";
import type { IThreadMessage } from "../interfaces/structures/ThreadMessage";

export class ThreadMessage extends Base implements IThreadMessage {
  public content?: string;
  public attachments?: any[];
  public createdAt?: Date;
  public createdTimestamp?: number;
  public mentions?: Record<string, string>;
  public thread?: { id?: string };
  public author?: { id?: string };

  public constructor(client: Client, data: MessageDelta) {
    super(client);

    this.patch(data);
  }

  private parseMentions(data: string | undefined, content: string) {
    if (typeof data !== "string") return {};
    const arr = JSON.parse(data) as MessageDeltaMention[];
    return arr.reduce((obj, data) => {
      obj[data.i] = content.substring(data.o, data.o + data.l);
      return obj;
    }, {} as Record<string, string>);
  }

  public patch(data: MessageDelta) {
    this.id = data.messageMetadata.messageId;
    this.content = data.body;
    this.attachments = data.attachments;
    this.createdTimestamp = parseInt(data.messageMetadata.timestamp);
    this.createdAt = new Date(this.createdTimestamp);
    this.mentions = this.parseMentions(data.data.prng, this.content);
    const threadKey = data.messageMetadata.threadKey;
    this.thread = {
      id: threadKey.threadFbId ?? threadKey.otherUserFbId
    };
    this.author = { id: data.messageMetadata.actorFbId };

    return data;
  }
}
