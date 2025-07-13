import { Gender } from "../facebookResponses/ThreadResponse";
import { UserType } from "../facebookResponses/UserResponse";

export interface IClientUser {
  id?: string;
  name?: string;
  firstName?: string;
  vanity?: string;
  avatarURL?: string;
  profileURL?: string;
  gender?: Gender;
  type?: UserType;
  alternateName?: string;
}
