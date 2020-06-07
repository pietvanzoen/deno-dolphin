import { Update } from "./updater.ts";
import GithubAPI from "../services/github-api.ts";
import { slugify } from "../../deps.ts";
import { Logger } from "../helpers/logger.ts";

export class GithubUpdater {
  private log = Logger();
  private static UPDATE_REPO = "pietvanzoen/updates";
  private github = new GithubAPI({
    privateToken: Deno.env.get("GITHUB_PRIVATE_TOKEN"),
  });

  create(update: Update) {
    const filepath = `test/${makeFileName(update)}`;
    const content = [
      makeFrontMatter({ date: update.timestamp.toISOString() }),
      update.content,
    ].join("\n");
    const message = `Add ${filepath}`;

    this.log.info(`Creating ${filepath}`);
    return this.github.repo(GithubUpdater.UPDATE_REPO).createFile(
      filepath,
      {
        message,
        content,
      },
    );
  }
}

export function makeFrontMatter(data: { [key: string]: string }): string {
  return [
    "---",
    ...Object.entries(data).map(([key, value]) => `${key}: "${value}"`),
    "---",
  ].join("\n");
}

export function makeFileName({ timestamp, content }: Update): string {
  const date = timestamp.toISOString().slice(0, 10);
  const slug = slugify(content.slice(0, 50), { lower: true });
  return `${date}-${slug}.md`;
}
