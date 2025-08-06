import { RestManager } from "./RestManager";
import { FacebookSelfbotError } from "./../errors/FacebookSelfbotError";

import type { RawCookies } from "./../types/cookies";

export type MessageOptions = {
    autoMarkRead?: boolean;
    autoMarkDelivery?: boolean;
    selfListen?: boolean;
};

export type ClientOptions = {
    userAgent?: string;
    message?: MessageOptions;
    online?: boolean;
    autoReconnect?: boolean;
    logLevel?: "info" | "warn" | "error";
};

export type CredentialsWithCookies = {
    cookies: RawCookies;
    email?: never;
    password?: never;
};

export type CredentialsWithCredentials = {
    cookies?: never;
    email: string;
    password: string;
};

export type Credentials = CredentialsWithCookies | CredentialsWithCredentials;

export class Client {
    public options: ClientOptions;
    public rest: RestManager;

    constructor(options?: ClientOptions) {
        this.options = {
            message: {
                autoMarkRead: true,
                ...options?.message,
            },
            autoReconnect: true,
            logLevel: "info",
            ...options,
        };

        this.rest = new RestManager();
    }

    async login(credentials: Credentials): Promise<void> {
        if ("cookies" in credentials) {
            if (!credentials.cookies) throw new FacebookSelfbotError("Missing cookies.");
            if (!Array.isArray(credentials.cookies)) {
                throw new FacebookSelfbotError("Cookies must be an array.");
            }
            await this.rest.setCookies(credentials.cookies);
        } else {
            if (!credentials.email || !credentials.password) {
                throw new FacebookSelfbotError("Missing email or password.");
            }
            const url = "https://api.facebook.com/method/auth.login";
            const params = {
                access_token: "350685531728|62f8ce9f74b12f84c123cc23437a4a32",
                format: "json",
                sdk_version: 2,
                email: credentials.email,
                locale: "en_US",
                password: credentials.password,
                generate_session_cookies: 1,
                sig: "c1c640010993db92e5afd11634ced864",
            };
            const { data } = await this.rest.get(url, params);
            if (data.error_code) throw new FacebookSelfbotError(data.error_msg);
            const { session_cookies } = data;
            if (!session_cookies || !Array.isArray(session_cookies)) {
                throw new FacebookSelfbotError("Login failed: No session cookies returned.");
            }
            await this.rest.setCookies(session_cookies);
        }
    }

    async getCookies() {
        return this.rest.getCookies();
    }
}
