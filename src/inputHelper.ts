
import * as core from '@actions/core'

export const inputNames = [
    "action_name",
    "owner",
    "repo",
    "event_type",
    "client_payload_json",
    "branch_current",
    "branch_new"
] as const;

export const availableActions = [
    "is_version_changed",
    "dispatch_event"
] as const;


export function getInputDescription(inputName: typeof inputNames[number]): string {
    switch(inputName){
        case "action_name": return `Action to run, one of: ${availableActions.map(s=>`"${s}"`).join(", ")}`;
        case "owner": return "Repository owner, example: 'garronej', github.repository_owner";
        case "repo": return "Repository name, example: 'evt', github.repository.name";
        case "event_type": return "see: https://developer.github.com/v3/repos/#create-a-repository-dispatch-event"
        case "client_payload_json": return "Example '{\"p\":\"foo\"}' see: https://developer.github.com/v3/repos/#create-a-repository-dispatch-event"
        case "branch_current": return "Name of a branch, example: 'master'";
        case "branch_new": return "Name of a branch, example: 'dev'";
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
