import { Logger } from "./src/helpers/logger.ts";
import { start } from "./src/app.ts";

const app = start();
const log = Logger();

app.addEventListener("listen", ({ hostname, port }) => {
  log.info(
    `Start listening on http://${hostname}:${port}`,
  );
});

await app.listen({ hostname: "0.0.0.0", port: 8000 });
