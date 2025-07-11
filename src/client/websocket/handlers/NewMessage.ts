import { Client } from "../../Client";
import { Events } from "../../../enums/ClientEvents";
import { MessageDelta } from "../../../interfaces/delta/Message";
import { ThreadMessage } from "../../../structures/ThreadMessage";

export function NewMessage(client: Client, delta: MessageDelta) {
  const threadMessage = new ThreadMessage(client, delta);
  client.emit(Events.MessageCreate, threadMessage);
}
