import { getEnvVar } from "../utils/env";

const Env = {
  MONGO_URI: getEnvVar("MONGO_URI"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
};

export { Env };
