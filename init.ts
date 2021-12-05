const fs = require("fs");

import VTrackerVideoEventStream from "./modules/VTrackerEventStream";
import Webhook from './modules/webhook';
import dayjs from "./modules/day";
import config from "./config/config.json";

let lastEventId: string = `${dayjs.utc().unix()}-1`;

if (fs.existsSync(config.pathEvent)) {
  lastEventId = fs.readFileSync(config.pathEvent, "utf8");
}

const eventStream = new VTrackerVideoEventStream({
  stream: 4,
  token: config.token,
  resume: lastEventId,
  entity: true,
});

// Events
eventStream.on("error", (x) => console.error(x.message)); // On Error
eventStream.on("close", (reason) => console.warn("Closed", reason));
eventStream.on("init", (data) => {
    console.info(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] Connected to VTracker API`);
    console.info(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ConnectionID: ${data.connectionId}`);
    console.info(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] Last event id: ${lastEventId}`);
});

eventStream.on("event", (data) => {
  if (!data.changesKey) {
    Webhook.send(data.video, data.channel);
    console.info(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${data.channel.title} was ${data.video.type} in video name ${data.video.title} [${data.video.id}]`);
  }

  fs.writeFileSync(config.pathEvent, data.eventId);
});

export default eventStream;
