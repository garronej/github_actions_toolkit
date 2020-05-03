
import { Octokit } from "@octokit/rest";
import { getCommitAsyncIterableFactory } from "../../octokit-addons/getCommitAsyncIterable";


(async function () {

    const octokit = new Octokit();

    const { getCommitAsyncIterable } = getCommitAsyncIterableFactory({ octokit });

    const commitAsyncIterable = getCommitAsyncIterable({
        "owner": "garronej",
        "repo": "test-repo",
        "branch": "master"
    });

    for await (const commit of commitAsyncIterable) {
        console.log(commit.commit.message);
    }

    console.log("done");

})();




