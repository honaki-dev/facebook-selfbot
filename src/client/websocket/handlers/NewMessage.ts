import { Client } from "../../Client";
import { Thread } from "../../../structures/Thread";
import { Events } from "../../../enums/ClientEvents";
import { ThreadMember } from "../../../structures/ThreadMember";
import { ThreadMessage } from "../../../structures/ThreadMessage";

import type { MessageDelta } from "../../../interfaces/delta/Message";
import type { ThreadResponse } from "../../../interfaces/facebookResponses/ThreadResponse";

export async function NewMessage(client: Client, delta: MessageDelta) {
  const threadKey = delta.messageMetadata.threadKey;
  const threadId = threadKey.threadFbId ?? threadKey.otherUserFbId;
  const authorId = delta.messageMetadata.actorFbId;

  let thread = client.threads.cache.get(threadId);
  let rawThread: ThreadResponse | undefined;

  if (!thread) {
    rawThread = await client.rest.thread.get(threadId);
    thread = new Thread(client, rawThread.o0.data.message_threads.nodes[0]);
    client.threads.cache.set(thread.id, thread);
  }

  let author = thread.members?.cache.get(authorId);
  if (!author) {
    if (!rawThread) {
      rawThread = await client.rest.thread.get(threadId);
    }

    const node =
      rawThread.o0.data.message_threads.nodes[0].all_participants.edges.find(
        (edge) => edge.node.messaging_actor.id === authorId
      )?.node;

    if (node) {
      author = new ThreadMember(client, node);
      thread.members?.cache.set(authorId, author);
    }
  }

  if (!author) {
    throw new Error("Author not found in thread participants.");
  }

  const threadMessage = new ThreadMessage(client, delta, thread, author);
  client.emit(Events.MessageCreate, threadMessage);
}
