
import fetch from "node-fetch";
const urlJoin: typeof import("path").join = require("url-join");
import { setOutputFactory } from "./outputHelper";

import { getActionParamsFactory } from "./inputHelper";

export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner",
        "repo",
        "branch_current",
        "branch_new"
    ] as const
});

export type Params = ReturnType<typeof getActionParams>;

type CoreLike = {
    debug: (message: string) => void;
};

const { setOutput } = setOutputFactory<"is_version_changed">();

export async function action(
    _actionName: "is_version_changed",
    params: Params,
    core: CoreLike
) {

    const { owner, repo, branch_current, branch_new } = params;

    const getVersion = (params: { branch: string; }) =>
        fetch(
            urlJoin(
                "https://raw.github.com",
                owner,
                repo,
                params.branch,
                "package.json"
            )
        )
            .then(res => res.text())
            .then(text => JSON.parse(text))
            .then(({ version }) => version as string)
            .catch(() => undefined)
        ;

    const versionOnBranchCurrent = await getVersion({ "branch": branch_current });
    const versionOnBranchNew = await getVersion({ "branch": branch_new });

    if (versionOnBranchCurrent === undefined) {

        core.debug(`No version of the module have been deployed on ${owner}/${repo}#${branch_current}`);

        setOutput({ "is_version_changed": `${versionOnBranchNew !== "0.0.0"}` });

        return;

    }

    if (versionOnBranchCurrent === versionOnBranchNew) {

        core.debug(`The package.json version ( currently ${versionOnBranchCurrent} ) has not changed since last release`);

        setOutput({ "is_version_changed": "false" });

        return;

    }

    core.debug(`Version changed ${versionOnBranchCurrent} -> ${versionOnBranchNew}`);

    setOutput({ "is_version_changed": "true" });

}