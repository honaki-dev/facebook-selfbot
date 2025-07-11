import { Client } from "../Client";
import { Cookie, CookieJar } from "tough-cookie";
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";

export class RestAPI {
  private jar: CookieJar;
  private axios: AxiosInstance;
  private client: Client;

  public facebookCookies: string;

  public constructor(client: Client) {
    this.jar = new CookieJar();

    for (const cookie of client.options.cookies) {
      const { key, value, domain, path } = cookie;
      if (!key || !value || !domain || !path) continue;
      const cookieObj = new Cookie({ key, value, domain, path });
      this.jar.setCookieSync(cookieObj, `https://${domain}`);
    }
    this.facebookCookies = this.jar.getCookieStringSync("https://facebook.com");

    this.client = client;
    this.axios = wrapper(
      axios.create({
        jar: this.jar,
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.facebook.com/",
          Host: new URL("https://www.facebook.com/").hostname,
          Origin: "https://www.facebook.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.2849.68",
          Connection: "keep-alive",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "Accept-Encoding": "gzip, deflate"
        }
      })
    );
  }

  public async get(...args: Parameters<AxiosInstance["get"]>) {
    return this.axios.get(...args);
  }

  public async post(...args: Parameters<AxiosInstance["post"]>) {
    return this.axios.post(...args);
  }

  private facebookLink(path?: string) {
    return `https://facebook.com${path ?? "/"}`;
  }

  public async parseData(data: string) {
    const newData = data.replace("for (;;);{", "{");
    return JSON.parse(newData);
  }

  public async refreshCsrf(): Promise<string | null> {
    const { status, data } = await this.get(
      this.facebookLink("/ajax/dtsg/?__a=true")
    );
    if (status !== 200) return null;
    const parsedData = await this.parseData(data);
    const csrf = parsedData.payload.token as string;
    return csrf;
  }

  public async init() {
    const { status, data } = await this.get(this.facebookLink(), {
      headers: { Accept: "text/html" }
    });

    if (status !== 200) return {};

    const html = data as string;

    const extract = (regex: RegExp): string => regex.exec(html)?.[1] ?? "";

    const jazoest = extract(/"jazoest".*?(\d+)/);
    const clientRevision = extract(/"client_revision":(\d+)/);
    const sequenceId = extract(
      /\\"upsertSequenceId\\",\[[^,]+,\\"([^\]]+)\\"\]/
    );

    const mqttMatch = html.match(
      /\["MqttWebConfig",\[\],{"fbid":"(.*?)","appID":219994525426954,"endpoint":"(.*?)","pollingEndpoint":"(.*?)"/
    );

    const userId = mqttMatch?.[1] ?? "0";
    const gateway = (mqttMatch?.[2] ?? "").replace(/\\/g, "");

    this.client.userId = userId;

    return { jazoest, clientRevision, gateway, sequenceId };
  }
}
