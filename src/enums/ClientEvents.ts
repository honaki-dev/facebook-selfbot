import { ThreadMessage } from "../structures/ThreadMessage";

export enum Events {
  Ready = "ready",
  MessageCreate = "messageCreate"
}

export interface ClientEvents {
  ready(): void;
  messageCreate(message: ThreadMessage): void;
}
