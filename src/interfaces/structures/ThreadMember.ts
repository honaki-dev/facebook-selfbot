import type { Gender, Typename } from "../facebookResponses/ThreadResponse";

export interface IThreadMember {
  id?: string;
  type?: Typename;
  name?: string;
  gender?: Gender;
  profileURL?: string;
  avatarURL?: string;
  firstName?: string;
  vanity?: string;
  isFriend?: boolean;
  isBirthday?: boolean;
}
