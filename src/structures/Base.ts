import { Client } from "../client/Client";

export abstract class Base {
  public readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  public abstract patch(data: any): any;
}
