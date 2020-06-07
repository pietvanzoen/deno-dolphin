import { Context, Router } from "../deps.ts";
import { renderTemplate } from "./helpers/render-template.ts";
import { GithubUpdater } from "./updaters/github.ts";
import { Update } from "./updaters/updater.ts";

export function routerInit(): Router {
  const githubUpdater = new GithubUpdater();
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
      const { content } = getFormValues(result.value);
      const data: Update = {
        timestamp: new Date(),
        content,
      };
      try {
        const resp = await githubUpdater.create(data);
        ctx.response.body = await renderTemplate(
          "success",
          {
            githubUrl: resp.content.html_url,
          },
        );
      } catch (error) {
        const errorJSON = await error.json();
        ctx.response.status = error.status;
        ctx.response.body = await renderTemplate(
          "form",
          {
            content,
            error: JSON.stringify(errorJSON, null, 2),
          },
        );
      }
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
