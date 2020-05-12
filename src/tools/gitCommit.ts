
import * as st from "scripting-tools";
import * as path from "path";
import { assert } from "evt/dist/tools/typeSafety/assert";

export async function gitCommit(
    params: {
        owner: string;
        repo: string;
        commitAuthorEmail: string;
        performChanges: ()=> Promise<{ commit: false; } | { commit: true; addAll: boolean; message: string; }>

    }
) {

    const { owner, repo, commitAuthorEmail, performChanges } = params;

    await st.exec(`git clone https://github.com/${owner}/${repo}`);

    const cwd = process.cwd();

    process.chdir(repo);

    const changesResult= await performChanges();

    if( changesResult.commit ){

        await st.exec(`git config --local user.email "${commitAuthorEmail}"`);
        await st.exec(`git config --local user.name "${commitAuthorEmail.split("@")[0]}"`);

        if( changesResult.addAll ){

            await st.exec(`git add -A`);

        }

        await st.exec(`git commit -am "${changesResult.message}"`);

        await st.exec(`git push "https://${owner}:${process.env["GITHUB_TOKEN"]}@github.com/${owner}/${repo}.git"`);

    }

    process.chdir(cwd);

    await st.exec(`rm -r ${repo}`);

}