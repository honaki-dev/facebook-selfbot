import { RestAPI } from "./RestAPI";

export class MessageAPI {
  private rest: RestAPI;

  public constructor(rest: RestAPI) {
    this.rest = rest;
  }

  // Get one by id
  public async get(messageId: string, threadId: string) {
    const form = {
      av: this.rest.client.userId,
      queries: JSON.stringify({
        o0: {
          doc_id: "1768656253222505",
          query_params: {
            thread_and_message_id: {
              thread_id: threadId,
              message_id: messageId
            }
          }
        }
      })
    };

    const resp = await this.rest.post(
      this.rest.facebookLink("/api/graphqlbatch/"),
      form
    );

    const parsedRequest = await this.rest.parseRequest(resp);

    return parsedRequest;
  }
}
