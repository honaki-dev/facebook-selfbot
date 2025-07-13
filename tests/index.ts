import { Client } from "../src";
import { readFileSync, writeFileSync } from "fs";
import { inspect } from "util";

const cookies = JSON.parse(readFileSync("cookies.json", "utf-8"));
const client = new Client({ cookies });

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.name}`);
});

client.on("messageCreate", async (message) => {
  const res = await client.rest.message.get(message.id, message.thread?.id!);
  writeFileSync("response-message.json", JSON.stringify(res));
});

client.start();
