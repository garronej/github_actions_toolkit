
import * as core from '@actions/core'

export const inputNames = [
    "action_name",
    "owner",
    "repo",
    "event_type",
    "client_payload_json",
    "branch",
    "branch_behind",
    "branch_ahead",
    "commit_author_name",
] as const;

export const availableActions = [
    "get_package_json_version",
    "dispatch_event",
    "update_changelog"
] as const;


export function getInputDescription(inputName: typeof inputNames[number]): string {
    switch(inputName){
        case "action_name": return `Action to run, one of: ${availableActions.map(s=>`"${s}"`).join(", ")}`;
        case "owner": return "Repository owner, example: 'garronej', github.repository_owner";
        case "repo": return "Repository name, example: 'evt', github.repository.name";
        case "event_type": return "see: https://developer.github.com/v3/repos/#create-a-repository-dispatch-event"
        case "client_payload_json": return "Example '{\"p\":\"foo\"}' see: https://developer.github.com/v3/repos/#create-a-repository-dispatch-event"
        case "branch": return "Example: master";
        case "branch_behind": return "Name of a branch, example: 'master'";
        case "branch_ahead": return "Name of a branch, example: 'dev'";
        case "commit_author_name": return "Name of the bot that will author the commit for updating the CHANGELOG.md file, ex: action (email will be action@github.com)"
    }
}



const getInput = (inputName: typeof inputNames[number]) => {

    if (inputNames.indexOf(inputName) < 0) {
        throw new Error(`${inputName} expected`);
    }

    return core.getInput(inputName);

}


export function getActionParamsFactory<U extends typeof inputNames[number]>(
    params: {
        inputNameSubset: readonly U[]
    }
) {

    const { inputNameSubset } = params;

    function getActionParams() {

        const params: Record<U, string> = {} as any;

        inputNameSubset.forEach(inputName => params[inputName] = getInput(inputName));

        return params;

    };

    return { getActionParams };

}

export function getActionName(): typeof availableActions[number] {
    return getInput("action_name") as any;
}
