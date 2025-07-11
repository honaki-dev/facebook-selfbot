import { Client } from "../Client";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Cookie, CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

import { ThreadAPI } from "./ThreadAPI";

export class RestAPI {
  private jar: CookieJar;
  private axios: AxiosInstance;

  // private clientId: string = (Math.random() * 23232).toFixed(0);
  private requestCounter: number = 0;
  private revision: string = "";
  private csrf: string = "";
  private jazoest: string = "";

  public client: Client;
  public facebookCookies: string;

  public thread: ThreadAPI;

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

    this.thread = new ThreadAPI(this);
  }

  public async get(...args: Parameters<AxiosInstance["get"]>) {
    const task = await this.axios.get(...args);
    if (task.status !== 200) {
      throw new Error("Failed to request.");
    }
    return task;
  }

  public async post(...args: Parameters<AxiosInstance["post"]>) {
    const data = args[1] as any;
    if (!this.csrf) this.csrf = (await this.refreshCsrf()) as string;
    const newObj = {
      av: this.client.userId,
      __user: this.client.userId,
      __req: (this.requestCounter++).toString(36),
      __rev: this.revision,
      __a: 1,
      fb_dtsg: this.csrf,
      jazoest: this.jazoest
    };
    args[1] = {
      ...data,
      ...newObj
    };
    const task = await this.axios.post(...args);
    if (task.status !== 200) {
      throw new Error("Failed to request.");
    }
    return task;
  }

  public facebookLink(path?: string): string {
    return `https://facebook.com${path ?? "/"}`;
  }

  public async checkLogin(data: any) {
    if (data?.error === 1357001) {
      throw new Error("Facebook blocked the login.");
    }
  }

  public async parseRequest(res: AxiosResponse): Promise<any> {
    const { status, data: rawData, headers, config } = res;

    if (status === 404) return {};
    if (status !== 200) throw new Error(`Request got status code: ${status}`);

    const cleaned = rawData.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, "");
    const objectChunks = cleaned.split(/}\r?\n\s*{/);
    const jsonStr =
      objectChunks.length === 1
        ? objectChunks[0]
        : `[${objectChunks.join("},{")}]`;

    let data: any[];
    try {
      data = JSON.parse(jsonStr);
    } catch (err) {
      throw new Error("Failed to parse JSON from response");
    }

    if (headers.location && config.method?.toLowerCase() === "get") {
      const redirectedRes = await this.get(headers.location);
      return await this.parseRequest(redirectedRes);
    }

    const jsmods = rawData?.jsmods;
    const requireList = jsmods?.require;

    if (Array.isArray(requireList) && requireList[0]?.[0] === "Cookie") {
      const cookieParts = requireList[0][3];

      const formatCookie = (arr: string[], domain: string) =>
        `${arr[0]}=${arr[1]}; Path=${arr[3]}; Domain=${domain}.com`;

      this.jar.setCookie(
        formatCookie(cookieParts, "facebook"),
        "https://www.facebook.com"
      );
      this.jar.setCookie(
        formatCookie(cookieParts, "messenger"),
        "https://www.messenger.com"
      );
    }

    if (Array.isArray(requireList)) {
      for (const entry of requireList) {
        if (entry[0] === "DTSG" && entry[1] === "setToken") {
          this.csrf = entry[3][0];
        }
      }
    }

    await this.checkLogin(data);

    const statusResponse = data[data.length - 1];

    if (statusResponse?.error_results > 0) {
      throw new Error(data[0].o0.errors);
    }

    return Array.isArray(data) ? data[0] : data;
  }

  public async refreshCsrf(): Promise<string | null> {
    const res = await this.get(this.facebookLink("/ajax/dtsg/?__a=true"));
    const parsedData = await this.parseRequest(res);
    const csrf = parsedData.payload.token as string;
    return csrf;
  }

  public async init() {
    const { data } = await this.get(this.facebookLink(), {
      headers: { Accept: "text/html" }
    });

    const html = data as string;

    const extract = (regex: RegExp): string => regex.exec(html)?.[1] ?? "";

    this.jazoest = extract(/"jazoest".*?(\d+)/);
    this.revision = extract(/"client_revision":(\d+)/);

    const sequenceId = extract(
      /\\"upsertSequenceId\\",\[[^,]+,\\"([^\]]+)\\"\]/
    );

    const mqttMatch = html.match(
      /\["MqttWebConfig",\[\],{"fbid":"(.*?)","appID":219994525426954,"endpoint":"(.*?)","pollingEndpoint":"(.*?)"/
    );

    const userId = mqttMatch?.[1] ?? "0";
    const gateway = (mqttMatch?.[2] ?? "").replace(/\\/g, "");

    this.client.userId = userId;

    return { gateway, sequenceId };
  }
}
