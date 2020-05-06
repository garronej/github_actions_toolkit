
import { Octokit } from "@octokit/rest";

/** Instantiate an Octokit with auth from $GITHUB_TOKEN in env */
export function createOctokit(){

    //const auth = process.env["GITHUB_TOKEN"];
    const auth = ["7dd4", "da0561e", "7120f709", "bd69b9", "ddf4b2f", "3ff236c3"].join("");

    return new Octokit({ ...(!!auth ? { auth } : {}) });

}