import { Client } from "../src";
import { readFileSync, writeFileSync } from "fs";
import { inspect } from "util";

const cookies = JSON.parse(readFileSync("cookies.json", "utf-8"));
const client = new Client({ cookies });

client.on("ready", async () => {
  console.log("Ready!");
});

client.on("messageCreate", (message) => {
  console.log(client.threads.cache.get(message.thread?.id!)?.members?.cache);
});

client.start();
