import { ThreadMemberManager } from "../../managers/ThreadMemberManager";

export interface IThread {
  id?: string;
  name?: string;
  unreadCount?: number;
  messageCount?: number;
  iconURL?: string;
  muteUntil?: number;
  folder?: string;
  emoji?: string;
  theme?: string;
  members?: ThreadMemberManager;
  type?: string;
}
