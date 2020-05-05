
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
    "commit_author_email",
    "exclude_commit_from_author_names_json"
] as const;

export const availableActions = [
    "get_package_json_version",
    "dispatch_event",
    "update_changelog",
    "sync_package_and_package_lock_version"
] as const;


export function getInputDescription(inputName: typeof inputNames[number]): string {
    switch(inputName){
        case "action_name": return [
            `Action to run, one of: `,
            availableActions.map(s=>`"${s}"`).join(", ")
        ].join("");
        case "owner": return [ 
            "Repository owner, example: 'garronej',",
            "github.repository_owner" 
        ].join("");
        case "repo": return [
            "Repository name, example: ",
            "'evt', github.event.repository.name" 
        ].join("");
        case "event_type": return [ 
            "see: https://developer.github.com/v3/",
            "repos/#create-a-repository-dispatch-event"
        ].join("");
        case "client_payload_json": return [ 
            "Example '{\"p\":\"foo\"}' see: https://developer.github.com/v3/",
            "repos/#create-a-repository-dispatch-event" 
        ].join("");
        case "branch": return "Example: master";
        case "branch_behind": return "Name of a branch, example: 'master'";
        case "branch_ahead": return "Name of a branch, example: 'dev'";
        case "commit_author_email": return [ 
            "Email id  of the bot that will author the commit for ",
            "updating the CHANGELOG.md file, ex: denoify_ci@github.com" 
        ].join("");
        case "exclude_commit_from_author_names_json": return [
            "For update_changelog, do not includes commit from user ", 
            `certain committer in the CHANGELOG.md, ex: '["denoify_ci"]'`
        ].join("");
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
