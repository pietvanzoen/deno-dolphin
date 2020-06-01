import { config } from "https://deno.land/x/dotenv/mod.ts";
import GithubAPI from "./github-api.ts";

console.log('config', config());
const github = new GithubAPI({ privateToken: config()['GITHUB_PRIVATE_TOKEN'] });

const repo = github.repo('pietvanzoen/updates');

try {
  console.log(await repo.createFile("test/hello-world.md", {
    message: 'test commit',
    content: '# hi there'
  }));
} catch (e) {
  console.error(e);
}
