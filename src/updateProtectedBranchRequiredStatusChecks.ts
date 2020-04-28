
import * as core from '@actions/core'
import { Octokit } from "@octokit/rest";

export async function updateProtectedBranchRequiredStatusChecks(
    params: Record<
        "repository" |
        "repository_owner" |
        "github_token" |
        "branch" |
        "required_status_checks_json",
        string
    >
) {

    core.warning("In updateProtectedBranchRequiredStatusChecks");

    const { github_token, repository, repository_owner, required_status_checks_json, branch } = params;


    const required_status_checks: string[] = JSON.parse(required_status_checks_json);

    core.warning(JSON.stringify({
        ...params,
        required_status_checks
    }, null, 2)); 

    const octokit = new Octokit({ "auth": github_token });

    const requestParameters = {
        branch,
        "repo": repository,
        "owner": repository_owner,
    } as const;

    try {

    let resp= await octokit
        .repos
        .addProtectedBranchAdminEnforcement(requestParameters)
        ;

    core.warning(JSON.stringify({ resp }, null, 2));

    }catch(error){

        core.warning(error.message);

        core.setFailed("On a foiré");

        return;

    }

    let resp2= await octokit
        .repos
        .updateProtectedBranchRequiredStatusChecks({
            ...requestParameters,
            "contexts": required_status_checks
        })
        ;

    core.warning(JSON.stringify({ resp2 }, null, 2));


}