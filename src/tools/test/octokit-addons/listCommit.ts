
import { listCommitFactory } from "../../octokit-addons/listCommit";
import { Octokit } from "@octokit/rest";

(async ()=>{

    const octokit = new Octokit();


    const { listCommit } = listCommitFactory({ octokit });

    const commits= await  listCommit({
        "owner": "garronej",
        "repo": "supreme_tribble",
        "branch": "dev",
        "sha": "84792f5719d0812e6917051b5c6331891187ca20"
    });

    console.log(JSON.stringify(commits, null, 2));

})();