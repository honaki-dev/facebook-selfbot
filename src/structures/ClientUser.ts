import { Base } from "./Base";
import { Client } from "../client/Client";

import type { IClientUser } from "../interfaces/structures/ClientUser";
import type {
  UserInfoResponse,
  UserType
} from "../interfaces/facebookResponses/UserResponse";
import type { Gender } from "../interfaces/facebookResponses/ThreadResponse";

export class ClientUser extends Base implements IClientUser {
  public name?: string;
  public firstName?: string;
  public vanity?: string;
  public avatarURL?: string;
  public profileURL?: string;
  public gender?: Gender;
  public type?: UserType;
  public alternateName?: string;

  public constructor(client: Client, data: UserInfoResponse) {
    super(client);

    this.patch(data);
  }

  private parseProfileURL(user: UserInfoResponse) {
    const { vanity, id } = user;
    return `https://www.facebook.com/${
      vanity ? vanity : `profile.php?id=${id}`
    }`;
  }

  public patch(data: UserInfoResponse) {
    this.id = data.id;
    this.name = data.name;
    this.firstName = data.firstName;
    this.vanity = data.vanity;
    this.avatarURL = data.thumbSrc;
    this.profileURL = this.parseProfileURL(data);
    this.gender = data.gender;
    this.type = data.type;
    this.alternateName = data.alternateName;

    return data;
  }
}
