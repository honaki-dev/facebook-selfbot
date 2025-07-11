import { Client } from "../client/Client";
import { BaseManager } from "./BaseManager";
import { Thread } from "../structures/Thread";
import { Collection } from "@discordjs/collection";

export class ThreadManager extends BaseManager {
  public cache: Collection<string, Thread>;

  public constructor(client: Client) {
    super(client);

    this.cache = new Collection();
  }

  public async fetch(force = false) {
    const response = await this.client.rest.thread.fetch();
    const nodes = response.o0.data.viewer.message_threads.nodes;

    const cache = new Collection<string, Thread>();

    for (const node of nodes) {
      const thread = new Thread(this.client, node);
      cache.set(thread.id, thread);
    }

    if (!force) this.cache = cache;

    return cache;
  }
}
