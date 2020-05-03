
import { getChangeLogFactory } from "../../octokit-addons/getChangeLog";
import { Octokit } from "@octokit/rest";

(async ()=>{

    const octokit = new Octokit();

    const { getChangeLog } = getChangeLogFactory({ octokit });

    const {commits}= await  getChangeLog({
        "owner": "garronej",
        "repo": "test-repo",
        "branchBehind": "garronej-patch-1",
        "branchAhead": "master"
    });

    const messages = commits.map(({ commit })=> commit.message );

    console.log(JSON.stringify(messages, null, 2));

})();