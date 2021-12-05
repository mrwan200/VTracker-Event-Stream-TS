import eventStream from './init'
import dayjs from "./modules/day";

console.info(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] Connecting to VTracker API`);
eventStream.start();