
import { Octokit } from "@octokit/rest";

/** Instantiate an Octokit with auth from $GITHUB_TOKEN in env */
export function createOctokit(){

    const auth = process.env["GITHUB_TOKEN"];

    return new Octokit({ ...(!!auth ? { auth } : {}) });

}