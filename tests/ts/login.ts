import { readFileSync } from "fs";
import { Client } from "../../src";

const client = new Client();

(async () => {
    const cookies = JSON.parse(readFileSync("./cookies.json", "utf-8"));
    client.login({ cookies });
})();
