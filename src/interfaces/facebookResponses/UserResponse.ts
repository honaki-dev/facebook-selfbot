import type { Gender } from "./ThreadResponse";

export interface UserResponse {
  __ar: number;
  rid: string;
  payload: Payload;
  lid: string;
}

export interface Payload {
  profiles: Profiles;
}

export type Profiles = Record<string, UserInfoResponse>;

export type UserType = "user" | "group" | "page" | "event" | "app";
export interface UserInfoResponse {
  id: string;
  name: string;
  firstName: string;
  vanity: string;
  thumbSrc: string;
  uri: string;
  gender: Gender;
  i18nGender: number;
  type: UserType;
  is_friend: boolean;
  mThumbSrcSmall: null;
  mThumbSrcLarge: null;
  dir: null;
  searchTokens: string[];
  alternateName: string;
  is_nonfriend_messenger_contact: boolean;
  is_blocked: boolean;
}
