
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

    core.debug("In updateProtectedBranchRequiredStatusChecks");

    const { github_token, repository, repository_owner, required_status_checks_json, branch } = params;

    const required_status_checks: string[] = JSON.parse(required_status_checks_json);

    const octokit = new Octokit({ "auth": github_token });

    const requestParameters = {
        branch,
        "repo": repository,
        "owner": repository_owner,
    } as const;

    await octokit
        .repos
        .addProtectedBranchAdminEnforcement(requestParameters)
        ;

    await octokit
        .repos
        .updateProtectedBranchRequiredStatusChecks({
            ...requestParameters,
            "contexts": required_status_checks
        })
        ;


}