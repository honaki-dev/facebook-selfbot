import { Client } from "../../Client";
import { ThreadMessage } from "../../../structures/ThreadMessage";
import { Events } from "../../../enums/ClientEvents";

export function NewMessage(client: Client, delta: any) {
  const threadMessage = new ThreadMessage(client, delta);
  client.emit(Events.MessageCreate, threadMessage);
}
