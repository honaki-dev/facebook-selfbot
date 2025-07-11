import { Base } from "./Base";
import { Client } from "../client/Client";
import { MessageThreadsNode } from "../interfaces/facebookResponses/ThreadResponse";

import type { IThread } from "../interfaces/structures/Thread";
import { ThreadMemberManager } from "../managers/ThreadMemberManager";

export class Thread extends Base implements IThread {
  public name?: string;
  public unreadCount?: number;
  public messageCount?: number;
  public iconURL?: string;
  public muteUntil?: number;
  public folder?: string;
  public emoji?: string;
  public theme?: string;
  public members?: ThreadMemberManager;
  public type?: string;

  public constructor(client: Client, data: MessageThreadsNode) {
    super(client);

    this.patch(data);
  }

  public patch(data: MessageThreadsNode) {
    const thread = data;
    const threadKey = thread.thread_key;
    this.id = threadKey.thread_fbid ?? threadKey.other_user_id ?? "";
    this.name = thread.name ?? "";
    this.unreadCount = thread.unread_count;
    this.messageCount = thread.messages_count;
    this.iconURL = thread.image?.uri;
    this.muteUntil = thread.mute_until ?? -1;
    this.folder = thread.folder;
    this.emoji = thread.customization_info?.emoji;
    this.theme = thread.customization_info?.outgoing_bubble_color;
    this.members = new ThreadMemberManager(
      this.client,
      this,
      data.all_participants.edges
    );
    this.type = thread.thread_type;

    return data;
  }
}
