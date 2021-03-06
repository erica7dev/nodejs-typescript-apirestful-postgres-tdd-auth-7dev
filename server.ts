import * as http from "http";
import * as debug from "debug";
import Api from "./api/api";
import { errorHandlerApi } from "./api/errorHandlerApi";
var models = require("./models");
const config = require("./config/env/config")();
debug("ts-api:server");

const port = normalizePort(config.server_port);

Api.set("port", port);
const server = http.createServer(Api);

models.sequelize.sync().then(() => {
  server.listen(port);
  server.on("error", onError);
  server.on("listening", listen);
});

Api.use(errorHandlerApi);

function listen(): void {
  let address = server.address();
  let bind =
    typeof address === "string" ? `Address ${address}` : `Port ${address.port}`;
  debug(`Server is runnig on port ${bind}`);
  console.log(`Server is runnig on port ${bind}`);
}

function onError(error: NodeJS.ErrnoException): void {
  console.log("An error ocurred: ", error);
}

function normalizePort(portNumber: number | string): string | number | boolean {
  let port: number =
    typeof portNumber === "string" ? parseInt(portNumber, 10) : portNumber;
  if (isNaN(port)) return portNumber;
  else if (port > 0) return port;
  else return false;
}
