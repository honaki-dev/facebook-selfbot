import { Base } from "./Base";
import { Client } from "../client/Client";
import { IThreadMember } from "../interfaces/structures/ThreadMember";

import type {
  EdgeNode,
  Gender,
  MessagingActor,
  Typename
} from "../interfaces/facebookResponses/ThreadResponse";

export class ThreadMember extends Base implements IThreadMember {
  public type?: Typename;
  public name?: string;
  public gender?: Gender;
  public profileURL?: string;
  public avatarURL?: string;
  public firstName?: string;
  public vanity?: string;
  public isFriend?: boolean;
  public isBirthday?: boolean;

  public constructor(client: Client, data: EdgeNode) {
    super(client);

    this.patch(data);
  }

  private parseProfileURL(actor: MessagingActor) {
    const { username, id } = actor;
    return `https://www.facebook.com/${
      username ? username : `profile.php?id=${id}`
    }`;
  }

  public patch(data: EdgeNode) {
    const actor = data.messaging_actor;
    this.id = actor.id;
    this.type = actor.__typename;
    this.name = actor.name;
    this.gender = actor.gender;
    this.profileURL = this.parseProfileURL(actor);
    this.avatarURL = actor.big_image_src.uri;
    this.firstName = actor.short_name;
    this.vanity = actor.username;
    this.isFriend = actor.is_viewer_friend;
    this.isBirthday = !!actor.is_birthday;

    return data;
  }
}
