import {
  dirname,
  fromFileUrl,
  pathResolve,
  TinyTemplate,
} from "../deps.ts";

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

async function getTemplate(templatePath: string): Promise<TinyTemplate> {
  if (cache.has(templatePath)) {
    return cache.get(templatePath);
  }
  const t = new TinyTemplate(decoder.decode(await Deno.readFile(templatePath)));
  cache.set(templatePath, t);
  return t;
}

function resolveTemplatePath(templateName: string) {
  return pathResolve(DIRNAME, "./templates", `${templateName}.tmpl.html`);
}
