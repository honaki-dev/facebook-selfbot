import { v4 as uuid } from "uuid";
import { RestAPI } from "./rest/RestAPI";
import { ClientEvents } from "../enums/ClientEvents";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketManagerOptions } from "./WebSocketManager";
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter";
import { getUsernamePayload } from "../util/Utils";
import { ThreadManager } from "../managers/ThreadManager";
import { ClientUser } from "../structures/ClientUser";

interface Cookie {
  key: string;
  value: string;
  domain: string;
  path: string;
}

interface ClientOptions {
  cookies: Cookie[];
  wsOptions?: WebSocketManagerOptions;
  onlineStatus?: boolean;
}

export declare interface Client {
  once<Event extends keyof ClientEvents>(
    eventName: Event,
    listener: ClientEvents[Event]
  ): this;
  on<Event extends keyof ClientEvents>(
    eventName: Event,
    listener: ClientEvents[Event]
  ): this;
  off<Event extends keyof ClientEvents>(
    eventName: Event,
    listener: ClientEvents[Event]
  ): this;
  emit<Event extends keyof ClientEvents>(
    eventName: Event,
    ...args: Parameters<ClientEvents[Event]>
  ): boolean;
}

export class Client extends AsyncEventEmitter {
  public options: ClientOptions;
  public rest: RestAPI;
  public ws!: WebSocketManager;

  // Client User
  public userId: string = "0";
  public user!: ClientUser;

  // Managers
  public threads: ThreadManager;

  public constructor(options: ClientOptions) {
    super();

    this.options = options;
    this.rest = new RestAPI(this);

    this.threads = new ThreadManager(this);
  }

  public async start() {
    const { gateway, sequenceId } = await this.rest.init();

    const rawUserInfo = await this.rest.user.fetch();
    this.user = new ClientUser(this, rawUserInfo.payload.profiles[this.userId]);

    await this.threads.fetch();

    const guid = uuid();
    const sessionId = (Math.random() * 2 ** 53).toFixed(0);

    const usernamePayload = getUsernamePayload({
      guid,
      sessionId,
      onlineStatus: this.options.onlineStatus ?? true,
      userId: this.userId
    });

    const wsOptions: WebSocketManagerOptions = {
      gateway: gateway,
      sequenceId: sequenceId,
      mqttOptions: {
        clientId: "mqttwsclient",
        protocolId: "MQIsdp",
        protocolVersion: 3,
        clean: true,
        keepalive: 10,
        reschedulePings: true,
        connectTimeout: 10 * 1000,
        reconnectPeriod: 1 * 1000,
        username: JSON.stringify(usernamePayload),
        wsOptions: {
          headers: {
            Cookie: this.rest.facebookCookies,
            Referer: "https://www.facebook.com/",
            Origin: "https://www.facebook.com",
            "User-Agent": usernamePayload.a,
            Host: new URL(gateway).hostname
          },
          origin: "https://www.facebook.com",
          protocolVersion: 13
        }
      }
    };

    this.ws = new WebSocketManager(this, wsOptions);
  }
}
