import { Octokit } from "@octokit/rest";
import { getActionParamsFactory } from "./inputHelper";

export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner", 
        "repo", 
        "event_type",
        "client_payload_json"
    ] as const
});

export type Params = ReturnType<typeof getActionParams>;


type CoreLike = {
    debug: (message: string) => void;
};

export async function action(
    _actionName: "dispatch_event",
    params: Params,
    core: CoreLike
) {

    core.debug(JSON.stringify({ _actionName, params }));

    const { owner, repo, event_type, client_payload_json } = params;

    const octokit = new Octokit();

    try {

        await octokit.repos.createDispatchEvent({
            owner,
            repo,
            event_type,
            ...(!!client_payload_json ?
                { "client_payload": JSON.parse(client_payload_json) } :
                {}
            )
        });

    } catch (error) {

        core.debug(`=============> error: ${error.message}`);

        throw error;

    }


}