import { Client } from "../src";
import { readFileSync } from "fs";

const cookies = JSON.parse(readFileSync("cookies.json", "utf-8"));
const client = new Client({ cookies });

client.on("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", (message) => {});

client.start();
