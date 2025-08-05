export type RawCookie = {
    name?: string;
    key?: string;
    value: string;
    domain: string;
};

export type RawCookies = Array<RawCookie>;
