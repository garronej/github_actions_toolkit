
import type { Octokit } from "@octokit/rest";
import { getCommonOriginFactory } from "./getCommonOrigin";
import { listCommitFactory } from "./listCommit";
import type { Commit } from "./getCommitAsyncIterable";

/** Take two branch that have a common origin and list all the 
 * commit that have been made on the branch that is ahead since it
 * has been forked from the branch that is behind */
export function getChangeLogFactory(
    params: { octokit: Octokit; }
) {

    const { octokit } = params;

    const { getCommonOrigin } = getCommonOriginFactory({ octokit });
    const { listCommit } = listCommitFactory({ octokit });

    async function getChangeLog(
        params: {
            owner: string;
            repo: string;
            branchBehind: string;
            branchAhead: string;
        }
    ): Promise<{ commits: Commit[]; }> {

        const { owner, repo, branchBehind, branchAhead } = params;

        const { sha } = await getCommonOrigin({
            owner,
            repo,
            "branch1": branchBehind,
            "branch2": branchAhead
        });

        const commits = await listCommit({
            owner,
            repo,
            "branch": branchAhead,
            sha
        });

        return { commits };


    }

    return { getChangeLog };



}