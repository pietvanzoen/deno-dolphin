import { config } from "https://deno.land/x/dotenv/mod.ts";
import {
  green,
  cyan,
  bold,
  yellow,
} from "https://deno.land/std@0.54.0/fmt/colors.ts";
import { renderTemplate } from "./src/render-template.ts";

import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(async (ctx) => {
  ctx.response.body = await renderTemplate("form", { message: "hello world" });
});

app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    bold("Start listening on ") + yellow(`${hostname}:${port}`),
  );
});

await app.listen({ port: 8000 });
console.log(bold("Finished."));
