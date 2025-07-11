import { Client } from "../client/Client";

export abstract class BaseManager {
  protected readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }
}
