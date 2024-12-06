import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

import { Pokemon, Message } from "./types";

const PORT = 8081;


const server = express();

const extensionOwner = process.env.EXTENSION_OWNER;
const extensionClientId = process.env.EXTENSION_CLIENT_ID;
const base64Secret = process.env.EXTENSION_SECRET;
const targetChannel = "" + process.env.EXTENSION_OWNER;

const MOCK_PARTY: Pokemon[] = [
  { id: 1, otid: 1, speciesName: "Cyndaquil", name: "Cyndaquil", level: 5 },
  { id: 2, otid: 2, speciesName: "Cubone", name: "son", level: 14 },
  { id: 3, otid: 3, speciesName: "Gengar", name: "BOO!", level: 69 },
  { id: 4, otid: 4, speciesName: "Bidoof", name: "bidoof1", level: 99 },
];

const test_data: Message = {
  type: "game_state",
  data: { party: MOCK_PARTY },
};

// console.log(JSON.stringify(test_data));

// build jwt
const makeJWT = function (
  base64Secret: string,
  extensionOwner: string,
  targetChannel: string
) {
  const secret = Buffer.from(base64Secret, "base64");
  const jwt_payload = {
    exp: Math.floor(new Date().getTime() / 1000) + 2 * 60 * 60,
    user_id: extensionOwner,
    role: "external",
    channel_id: targetChannel,
    pubsub_perms: {
      send: ["broadcast"],
    },
  };
  console.log(`secret is ${secret}`);

  return jwt.sign(jwt_payload, secret);
};

server.get("/", (req, res) => {
  res.send("EBS server!");

  const payload = {
    target: ["broadcast"],
    broadcaster_id: targetChannel,
    message: JSON.stringify(test_data),
  };
  const serialized = JSON.stringify(payload);

  console.log(`Sending payload ${serialized}`);
  console.log(`with client id ${extensionClientId}`);

  if (
    base64Secret === undefined ||
    extensionOwner === undefined ||
    targetChannel === undefined
  ) {
    console.log(`parameters cannot be undefined`);
    return;
  }

  const token = makeJWT(base64Secret, extensionOwner, targetChannel);

  // do the request
  //   fetch(`https://api.twitch.tv/helix/extensions/pubsub`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Client-Id": extensionClientId,
  //       "Content-Type": "application/json; charset=utf-8",
  //       "Content-Length": serialized.length,
  //     },
  //     body: serialized,
  //   })
  //     .then((res) => {
  //       console.log(`statusCode: ${res.status}`);
  //       console.log(`res: ${res}`);
  //       if (!res.ok) {
  //         res.text().then((text) => {
  //           console.log(res.headers);
  //           console.log(text);
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  // probably use node https instead of node-fetch
  fetch(`https://api.twitch.tv/helix/extensions/pubsub`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "Client-Id": extensionClientId,
      "Content-Type": "application/json; charset=utf-8",
     //   "Content-Length": payload.length,
    }),
    body: serialized,
  })
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      console.log(`res: ${res}`);
      if (!res.ok) {
        res.text().then((text) => {
          console.log(res.headers);
          console.log(text);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

server.get("/ping", (req, res) => {
  res.send("OK");
});

server.post("/send", (req, res) => {
  res.send("OK");
});

server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
