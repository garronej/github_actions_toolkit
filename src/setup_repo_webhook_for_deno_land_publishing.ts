
import { getActionParamsFactory } from "./inputHelper";
import { createOctokit } from "./tools/createOctokit";
import * as is_well_formed_and_available_module_name from "./is_well_formed_and_available_module_name";

export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner",
        "repo"
    ] as const
});

export type Params = ReturnType<typeof getActionParams>;

type CoreLike = {
    debug: (message: string) => void;
    warning: (message: string) => void;
};



export async function action(
    _actionName: "setup_repo_webhook_for_deno_land_publishing",
    params: Params,
    core: CoreLike
): Promise<void> {

    const { owner, repo } = params;

    const { is_available_on_deno_land } = await is_well_formed_and_available_module_name.action(
        "is_well_formed_and_available_module_name",
        { "module_name": repo },
        core
    );

    if (!is_available_on_deno_land) {

        throw new Error(`${repo} module name is no longer available`);

    }

    const octokit = createOctokit();

    await octokit.repos.createWebhook({
        owner,
        repo,
        "active": true,
        "events": [ "create"],
        "config": {
            "url": `https://api.deno.land/webhook/gh/${repo}?subdir=deno_dist%252F`,
            "content_type": "json"
        }
    });

}