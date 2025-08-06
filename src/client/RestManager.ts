import { CookieJar } from "tough-cookie";
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";

import type { RawCookies } from "./../types/cookies";

export class RestManager {
    public axios: AxiosInstance;
    private jar: CookieJar;

    constructor() {
        const jar = new CookieJar();
        this.jar = jar;

        const client = axios.create({
            withCredentials: true,
            jar,
        });
        const wrapped = wrapper(client);

        this.axios = wrapped;
    }

    async setCookies(cookies: RawCookies) {
        for (const cookie of cookies) {
            this.jar.setCookie(
                `${cookie.key ?? cookie.name}=${cookie.value}`,
                `https://${cookie.domain?.startsWith(".") ? cookie.domain.slice(1) : cookie.domain}`
            );
        }
    }

    async getCookies(domain?: string) {
        return this.jar.getCookies(domain ?? "https://facebook.com/");
    }

    async post(url: string, data?: any) {
        return await this.axios.post(url, data);
    }

    async get(url: string, params?: any) {
        return await this.axios.get(url, { params });
    }
}
