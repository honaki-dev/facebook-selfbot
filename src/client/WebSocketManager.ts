import { Client } from "./Client";
import WebSocketStream from "websocket-stream";
import { MqttClient, IClientOptions } from "mqtt";
import * as WebSocketHandlers from "./websocket/handlers";

export interface WebSocketManagerOptions {
  gateway: string;
  sequenceId: string;
  mqttOptions: IClientOptions;
  userAgent?: string;
}

export class WebSocketManager extends MqttClient {
  public readonly managerOptions: WebSocketManagerOptions;
  public readonly client: Client;
  public readonly topics: string[] = [
    "/legacy_web",
    "/webrtc",
    "/rtc_multi",
    "/onevc",
    "/br_sr",
    "/sr_res",
    "/t_ms",
    "/thread_typing",
    "/orca_typing_notifications",
    "/notify_disconnect",
    "/orca_presence",
    "/inbox",
    "/mercury",
    "/messaging_events",
    "/orca_message_notifications",
    "/pp",
    "/webrtc_response"
  ];

  private lastSequenceId: string | number = 0;

  public constructor(client: Client, options: WebSocketManagerOptions) {
    const wsOpts = options.mqttOptions.wsOptions ?? ({} as any);
    const buildStream = () => WebSocketStream(options.gateway, wsOpts);
    super(buildStream, options.mqttOptions);

    this.client = client;
    this.managerOptions = options;

    this.handle();
  }

  private handle() {
    this.on("connect", () => {
      console.log(`Connected.`);
      this.client.emit(`ready`);
      this.subscribe(this.topics);

      if (!this.lastSequenceId) {
        this.lastSequenceId = this.managerOptions.sequenceId;
      }

      const queuePayload = JSON.stringify({
        sync_api_version: 10,
        max_deltas_able_to_process: 100,
        delta_batch_size: 500,
        encoding: "JSON",
        entity_fbid: this.client.userId,
        initial_titan_sequence_id: this.lastSequenceId
      });

      this.publish("/messenger_sync_create_queue", queuePayload, { qos: 0 });
    });

    this.on("message", (topic, payload) => {
      console.log(topic, JSON.parse(payload.toString()));
      const data = JSON.parse(payload.toString());

      switch (topic) {
        case "/t_ms":
          this.lastSequenceId =
            data.lastIssuedSeqId ?? data.firstDeltaSeqId ?? this.lastSequenceId;

          if (!data.deltas) break;

          for (const delta of data.deltas) {
            const handlerKey = delta.class as keyof typeof WebSocketHandlers;

            const handler = WebSocketHandlers[handlerKey];
            if (typeof handler === "function") {
              handler(this.client, delta);
            }
          }

          break;

        default:
          break;
      }
    });

    this.on("error", console.error);
  }
}
