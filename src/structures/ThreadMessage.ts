import { Base } from "./Base";
import { Client } from "../client/Client";
import { inspect } from "util";

export class ThreadMessage extends Base {
  public constructor(client: Client, data: any) {
    super(client);

    this.patch(data);
  }

  public patch(data: any) {
    console.log(
      inspect(data, {
        showHidden: false,
        depth: null,
        colors: true,
        compact: false
      })
    );
    return data;
  }
}
