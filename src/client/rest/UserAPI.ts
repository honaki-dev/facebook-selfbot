import { RestAPI } from "./RestAPI";

import type { UserResponse } from "../../interfaces/facebookResponses/UserResponse";

export class UserAPI {
  private rest: RestAPI;

  public constructor(rest: RestAPI) {
    this.rest = rest;
  }

  // Get by list id
  public async fetch(ids?: string[]) {
    if (!ids) {
      return await this.get(this.rest.client.userId);
    }
    const form = {
      av: this.rest.client.userId
    } as any;

    ids.forEach((id, i) => (form[`ids[${i}]`] = id));

    const resp = await this.rest.post(
      this.rest.facebookLink("/chat/user_info/"),
      form
    );

    const parsedRequest = await this.rest.parseRequest(resp);
    return parsedRequest as UserResponse;
  }

  // Get one by id
  public async get(id: string) {
    const form = {
      av: this.rest.client.userId,
      "ids[0]": id
    };

    const resp = await this.rest.post(
      this.rest.facebookLink("/chat/user_info/"),
      form
    );

    const parsedRequest = await this.rest.parseRequest(resp);
    return parsedRequest as UserResponse;
  }
}
