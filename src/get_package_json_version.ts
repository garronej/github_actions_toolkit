
import fetch from "node-fetch";
const urlJoin: typeof import("path").join = require("url-join");
import { setOutputFactory } from "./outputHelper";

import { getActionParamsFactory } from "./inputHelper";

export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner",
        "repo",
        "branch"
    ] as const
});

export type Params = ReturnType<typeof getActionParams>;

type CoreLike = {
    debug: (message: string) => void;
};

export const { setOutput } = setOutputFactory<"version">();

export async function action(
    _actionName: "get_package_json_version",
    params: Params,
    core: CoreLike
): Promise<Parameters<typeof setOutput>[0]> {

    const { owner, repo, branch } = params;

    const version = await fetch(
        urlJoin(
            "https://raw.github.com",
            owner,
            repo,
            branch,
            "package.json"
        )
    )
        .then(res => res.text())
        .then(text => JSON.parse(text))
        .then(({ version }) => version as string)
        .catch(() => "")
        ;

    core.debug(`Version on ${owner}/${repo}#${branch} is ${version}`);

    return { version };

}