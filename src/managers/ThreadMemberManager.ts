import { Client } from "../client/Client";
import { BaseManager } from "./BaseManager";
import { Thread } from "../structures/Thread";
import { Collection } from "@discordjs/collection";
import { ThreadMember } from "../structures/ThreadMember";

import type { Edge } from "../interfaces/facebookResponses/ThreadResponse";

export class ThreadMemberManager extends BaseManager {
  private thread: Thread;
  public cache: Collection<string, ThreadMember>;

  public constructor(client: Client, thread: Thread, data: Edge[]) {
    super(client);

    this.cache = new Collection();
    this.thread = thread;

    this.patch(data);
  }

  public patch(data: Edge[]) {
    const cache = new Collection<string, ThreadMember>();

    for (const edge of data) {
      const member = new ThreadMember(this.client, edge.node);
      cache.set(member.id, member);
    }

    this.cache = cache;

    return data;
  }

  public async fetch(force = false) {
    const response = await this.client.rest.thread.get(this.thread.id);
    const thread = response.o0.data.message_threads.nodes[0];

    const cache = new Collection<string, ThreadMember>();

    for (const edge of thread.all_participants.edges) {
      const member = new ThreadMember(this.client, edge.node);
      cache.set(member.id, member);
    }

    if (!force) this.cache = cache;

    return cache;
  }
}
