import { Context, Status, HttpError } from "../../deps.ts";
import { Logger } from "../helpers/logger.ts";
import { renderTemplate } from "../helpers/render-template.ts";

const log = Logger();

export async function handleError(ctx: Context, next: any) {
  try {
    await next();
  } catch (e) {
    let status = 0;
    let message = "";
    log.warn(e.message, e);
    if (e instanceof HttpError) {
      status = e.status;
      message = e.expose ? e.message : Status[status];
    } else if (e instanceof Error) {
      status = Status.InternalServerError;
      message = "Internal Server Error";
      log.error("Unhandled Error:", e.message);
      log.error(e.stack);
    }
    ctx.response.status = status;
    ctx.response.body = await renderTemplate(
      "error",
      { message: `${status} - ${message}` },
    );
  }
}
export async function handleNotFound(ctx: Context) {
  ctx.response.status = Status.NotFound;
  ctx.response.body = await renderTemplate(
    "error",
    { message: statusMessage(Status.NotFound) },
  );
}

function statusMessage(status: number) {
  return `${status} - ${Status[status]}`;
}
