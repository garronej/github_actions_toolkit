
import fetch from "node-fetch";
const urlJoin: typeof import("path").join = require("url-join");
import { setOutputFactory } from "./outputHelper";
import { NpmModuleVersion } from "./tools/NpmModuleVersion";
import { getActionParamsFactory } from "./inputHelper";
import { listTagsFactory } from "./tools/octokit-addons/listTags";
import { createOctokit } from "./tools/createOctokit";

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

export const { setOutput } = setOutputFactory<"from_version" | "to_version" | "is_upgraded_version">();

export async function action(
    _actionName: "is_package_json_version_upgraded",
    params: Params,
    core: CoreLike
): Promise<Parameters<typeof setOutput>[0]> {

    core.debug(JSON.stringify(params));

    const { owner, repo, branch } = params;

    const to_version = await getPackageJsonVersion({ owner, repo, branch });

    core.debug(`Version on ${owner}/${repo}#${branch} is ${NpmModuleVersion.stringify(to_version)}`);

    const from_version = await getLatestSemVersionedTag({ owner, repo });

    core.debug(`Last version was ${NpmModuleVersion.stringify(from_version)}`);

    const is_upgraded_version = NpmModuleVersion.compare(
        to_version,
        from_version
    ) === 1 ? "true" : "false";

    core.debug(`Is version upgraded: ${is_upgraded_version}`);

    return {
        "to_version": NpmModuleVersion.stringify(to_version),
        "from_version": NpmModuleVersion.stringify(from_version),
        is_upgraded_version
    };

}

async function getPackageJsonVersion(params: {
    owner: string;
    repo: string;
    branch: string;
}): Promise<NpmModuleVersion> {

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

    return NpmModuleVersion.parse(version || "0.0.0");

}

const getLatestSemVersionedTag = async (params: { owner: string; repo: string; }) => {

    const { owner, repo } = params;

    const semVersionedTags: string[] = [];

    const { listTags } = listTagsFactory({ "octokit": createOctokit() });

    for await (const tag of listTags({ owner, repo })) {

        const match = tag.match(/^v([0-9]+\.[0-9]+\.[0-9]+)$/);

        if (!match) {
            continue;
        }

        semVersionedTags.push(match[1]);

    }

    return semVersionedTags
        .map(NpmModuleVersion.parse)
        .sort((vX, vY) => NpmModuleVersion.compare(vY, vX))
    [0];

};
