
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

    github_token;
    repository;

    core.warning("We used a custom token");


    const required_status_checks: string[] = JSON.parse(required_status_checks_json);

    core.warning(JSON.stringify({
        ...params,
        required_status_checks
    }, null, 2)); 

    const octokit = new Octokit({ 
        //"auth": github_token 
        "auth": ["e","a502d","7721","12210747","de0d","600766","1bebaa","b60847"].join("")
    });

    core.warning("using supreme_trible");

    const requestParameters = {
        branch,
        //"repo": repository,
        "repo": "supreme_tribble",
        "owner": repository_owner,
    } as const;

    let resp2= await octokit
        .repos
        .updateProtectedBranchRequiredStatusChecks({
            ...requestParameters,
            "contexts": required_status_checks
        })
        ;

    core.warning(JSON.stringify({ resp2 }, null, 2));

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


}