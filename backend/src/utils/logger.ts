import fs from "fs";
import path from "path";

import { env } from "../config/env";

const getLogDir = () => {
  const dir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const getDateStamp = () => new Date().toISOString().slice(0, 10);

const safeStringify = (payload: unknown) => {
  try {
    return JSON.stringify(payload);
  } catch {
    return "\"[unserializable payload]\"";
  }
};

const writeLine = (fileName: string, line: string) => {
  const dir = getLogDir();
  fs.appendFileSync(path.join(dir, fileName), `${line}\n`);
};

export const logInfo = (message: string) => {
  const timestamp = new Date().toISOString();
  writeLine(`info-${getDateStamp()}.log`, `${timestamp} INFO ${message}`);
};

export const logDebug = (message: string, payload?: unknown) => {
  if (env.logLevel !== "debug") return;
  const timestamp = new Date().toISOString();
  const details = payload === undefined ? "" : ` ${safeStringify(payload)}`;
  writeLine(`debug-${getDateStamp()}.log`, `${timestamp} DEBUG ${message}${details}`);
};
