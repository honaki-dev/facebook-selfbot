export interface MessageDeltaMention {
  o: number;
  l: number;
  i: string;
  t: "p" | string;
}

export interface MessageDelta {
  attachments: any[];
  body: string;
  data: {
    eitm_timestamp: string;
    prng?: string;
  };
  messageMetadata: {
    actorFbId: string;
    cid: {
      conversationFbid: string;
    };
    messageId: string;
    offlineThreadingId: string;
    tags: string[];
    threadKey: {
      otherUserFbId?: string;
      threadFbId: string;
    };
    threadReadStateEffect: string;
    timestamp: string;
    unsendType: string;
    skipBumpThread: boolean;
  };
  class: "NewMessage";
}
