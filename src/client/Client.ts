import { v4 as uuid } from "uuid";
import { RestAPI } from "./rest/RestAPI";
import { ClientEvents } from "../enums/ClientEvents";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketManagerOptions } from "./WebSocketManager";
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter";

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

  public constructor(options: ClientOptions) {
    super();

    this.options = options;
    this.rest = new RestAPI(this);
  }

  public async start() {
    const { gateway, sequenceId } = await this.rest.init();

    const guid = uuid();
    const sessionId = (Math.random() * 2 ** 53).toFixed(0);
    const usernamePayload = {
      a: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      asi: null,
      aid: 2220391788200892,
      aids: null,
      chat_on: this.options.onlineStatus,
      cp: 3,
      ct: "websocket",
      d: guid,
      dc: "",
      ecp: 10,
      fg: false,
      gas: null,
      mqtt_sid: "",
      no_auto_fg: true,
      p: null,
      pack: [],
      php_override: "",
      pm: [],
      s: sessionId,
      st: [],
      u: this.userId
    };

    const wsOptions: WebSocketManagerOptions = {
      gateway: gateway as string,
      sequenceId: sequenceId as string,
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
            Host: new URL(gateway as string).hostname
          },
          origin: "https://www.facebook.com",
          protocolVersion: 13
        }
      }
    };
    this.ws = new WebSocketManager(this, wsOptions);
  }
}
