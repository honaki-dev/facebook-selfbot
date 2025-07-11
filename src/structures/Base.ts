import { Client } from "../client/Client";

export abstract class Base {
  public readonly client: Client;
  public id!: string;

  public constructor(client: Client) {
    this.client = client;
  }

  public abstract patch(data: any): any;

  public valueOf() {
    return this.id;
  }
}
