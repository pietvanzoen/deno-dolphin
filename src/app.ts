import { Application, Status, organ, Context } from "../deps.ts";
import { routerInit } from "./routes.ts";
import { handleError, handleNotFound } from "./middleware/error-handler.ts";

export function start(): Application {
  const app = new Application();

  app.use(organ("short"));
  app.use(handleError);

  const router = routerInit();
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async (ctx: Context) => {
    await ctx.send({
      root: `${Deno.cwd()}/static`,
    });
  });

  app.use(handleNotFound);

  return app;
}
