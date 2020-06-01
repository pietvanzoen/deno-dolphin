import {
  dirname,
  fromFileUrl,
  resolve,
} from "https://deno.land/std/path/mod.ts";
import { Template } from "https://deno.land/x/tiny_templates/mod.ts";

const DIRNAME = dirname(fromFileUrl(import.meta.url));
const cache = new Map();
const decoder = new TextDecoder("utf-8");

export async function renderTemplate(
  templateName: string,
  data = {},
): Promise<string> {
  const layout = await getTemplate(resolveTemplatePath("_layout"));
  const t = await getTemplate(resolveTemplatePath(templateName));
  return layout.render({ body: t.render(data) });
}

async function getTemplate(templatePath: string): Promise<Template> {
  if (cache.has(templatePath)) {
    return cache.get(templatePath);
  }
  const t = new Template(decoder.decode(await Deno.readFile(templatePath)));
  cache.set(templatePath, t);
  return t;
}

function resolveTemplatePath(templateName: string) {
  return resolve(DIRNAME, "./templates", `${templateName}.tmpl.html`);
}
