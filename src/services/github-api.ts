import { base64encode } from "../helpers/base64.ts";
import APIClient, { Headers } from "./api-client.ts";

interface CreateFileData {
  message: string;
  content: string;
  committer?: {
    name: string;
    email: string;
  };
}

class ReposAPI {
  private owner: string;
  private repo: string;
  private api: APIClient;

  constructor(
    { owner, repo, api }: { owner: string; repo: string; api: APIClient },
  ) {
    this.owner = owner;
    this.repo = repo;
    this.api = api;
  }

  createFile(filePath: string, data: CreateFileData) {
    const path = `/repos/${this.owner}/${this.repo}/contents/${filePath}`;
    return this.api.put(path, {
      ...data,
      content: base64encode(data.content),
    });
  }
}

interface GithubAPIConfig {
  privateToken?: string;
}

class GithubAPI {
  private api: APIClient;

  constructor(private config: GithubAPIConfig = {}) {
    const headers: Headers = {
      Accept: "application/vnd.github.v3.raw+json",
    };
    if (this.config.privateToken) {
      headers.Authorization = `token ${this.config.privateToken}`;
    }
    this.api = new APIClient({
      baseUrl: "https://api.github.com/",
      headers,
    });
  }

  repo(repoPath: string) {
    const [owner, repo] = repoPath.split("/");
    return new ReposAPI({ owner, repo, api: this.api });
  }
}

export default GithubAPI;
