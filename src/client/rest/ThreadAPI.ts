import { RestAPI } from "./RestAPI";

import type {
  ThreadListResponse,
  ThreadResponse
} from "../../interfaces/facebookResponses/ThreadResponse";

export class ThreadAPI {
  private rest: RestAPI;

  public constructor(rest: RestAPI) {
    this.rest = rest;
  }

  // Get all threads
  public async fetch() {
    const form = {
      av: this.rest.client.userId,
      queries: JSON.stringify({
        o0: {
          doc_id: "3336396659757871",
          query_params: {
            limit: 2 ** 53,
            before: null,
            tags: [],
            includeDeliveryReceipts: true,
            includeSeqID: false
          }
        }
      }),
      batch_name: "MessengerGraphQLThreadlistFetcher"
    };

    const resp = await this.rest.post(
      this.rest.facebookLink("/api/graphqlbatch/"),
      form
    );

    const parsedRequest = await this.rest.parseRequest(resp);
    return parsedRequest as ThreadListResponse;
  }

  // Get one by id
  public async get(id: string) {
    const form = {
      av: this.rest.client.userId,
      queries: JSON.stringify({
        o0: {
          doc_id: "3449967031715030",
          query_params: {
            id,
            message_limit: 0,
            load_messages: false,
            load_read_receipts: false,
            before: null
          }
        }
      }),
      batch_name: "MessengerGraphQLThreadlistFetcher"
    };

    const resp = await this.rest.post(
      this.rest.facebookLink("/api/graphqlbatch/"),
      form
    );

    const parsedRequest = await this.rest.parseRequest(resp);
    return parsedRequest as ThreadResponse;
  }
}
