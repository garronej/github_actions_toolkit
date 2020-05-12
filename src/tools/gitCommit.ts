
import * as st from "scripting-tools";
import * as path from "path";
import { assert } from "evt/dist/tools/typeSafety/assert";

export async function gitCommit(
    params: {
        owner: string;
        repo: string;
        addAll: boolean;
        commitMessage: string;
        removeFolderAfterward: boolean;
        commitAuthorEmail: string;

    }
) {

    const { owner, repo, addAll, commitMessage, commitAuthorEmail, removeFolderAfterward } = params;

    await st.exec(`git config --local user.email "${commitAuthorEmail}"`);
    await st.exec(`git config --local user.name "${commitAuthorEmail.split("@")[0]}"`);


    if (addAll) {
        await st.exec(`git add -A`);
    }

    await st.exec(`git commit -am "${commitMessage}"`);

    await st.exec(`git push "https://${owner}:${process.env["GITHUB_TOKEN"]}@github.com/${owner}/${repo}.git"`);

    if (removeFolderAfterward) {

        const cwd = process.cwd();

        assert(path.basename(cwd) === repo, `We should be in a repository named ${repo}`);

        process.chdir(path.join(cwd, ".."));

        await st.exec(`rm -r ${cwd}`);

    }

}