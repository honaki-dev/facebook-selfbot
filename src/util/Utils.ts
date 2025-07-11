interface UsernameOptions {
  onlineStatus: boolean;
  guid: string;
  sessionId: string;
  userId: string;
}

export function getUsernamePayload(options: UsernameOptions) {
  return {
    a: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    asi: null,
    aid: 2220391788200892,
    aids: null,
    chat_on: options.onlineStatus,
    cp: 3,
    ct: "websocket",
    d: options.guid,
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
    s: options.sessionId,
    st: [],
    u: options.userId
  };
}
