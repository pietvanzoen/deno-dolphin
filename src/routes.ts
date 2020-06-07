import { Context, Router } from "../deps.ts";
import { renderTemplate } from "./helpers/render-template.ts";

export function routerInit(): Router {
  const router = new Router();
  router
    .get("/", async (ctx: Context) => {
      ctx.response.body = await renderTemplate("form", { message: "hello" });
    })
    .post("/", async (ctx: Context) => {
      const result = await ctx.request.body({
        contentTypes: {
          form: ["application/x-www-form-urlencoded"],
        },
      });
      ctx.response.body = await renderTemplate(
        "form",
        {
          content: "submitted!\n" +
            JSON.stringify(getFormValues(result.value), null, 2),
        },
      );
    });

  return router;
}

function getFormValues(values: URLSearchParams) {
  const parsed: { [key: string]: string } = {};
  for (let [key, item] of values) {
    parsed[key] = item;
  }
  return parsed;
}
