
import * as st from "scripting-tools";

export async function gitPush(
    params: {
        owner: string;
        repo: string;
    }
) {

    const { owner, repo } = params;

    await st.exec(`git push "https://${owner}:${process.env["GITHUB_TOKEN"]}@github.com/${owner}/${repo}.git"`);

}