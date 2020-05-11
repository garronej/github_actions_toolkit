
import { getActionParamsFactory } from "./inputHelper";
import * as st from "scripting-tools";
import { getChangeLogFactory } from "./tools/octokit-addons/getChangeLog";
import * as get_package_json_version from "./get_package_json_version";
import * as fs from "fs";
import { NpmModuleVersion } from "./tools/NpmModuleVersion";
import { assert } from "evt/dist/tools/typeSafety";
import { createOctokit } from "./tools/createOctokit";
import { gitPush } from "./tools/gitPush";

export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner",
        "repo",
        "branch_behind",
        "branch_ahead",
        "commit_author_email",
        "exclude_commit_from_author_names_json"
    ] as const
});

export type Params = ReturnType<typeof getActionParams>;

type CoreLike = {
    debug: (message: string) => void;
};

export async function action(
    _actionName: "update_changelog",
    params: Params,
    core: CoreLike
) {

    const { 
        owner, 
        repo, 
        branch_ahead, 
        branch_behind, 
        commit_author_email
    } = params;

    core.debug(`params: ${JSON.stringify(params)}`);

    const exclude_commit_from_author_names: string[]= 
        JSON.parse(params.exclude_commit_from_author_names_json)
        ;

    const octokit = createOctokit();

    const { getChangeLog } = getChangeLogFactory({ octokit });

    const { commits } = await getChangeLog({
        owner,
        repo,
        "branchBehind": branch_behind,
        "branchAhead": branch_ahead
    });

    const [
        branchBehindVersion,
        branchAheadVersion
    ] = await Promise.all(
        ([branch_behind, branch_ahead] as const)
            .map(branch =>
                get_package_json_version.action(
                    "get_package_json_version",
                    {
                        owner,
                        repo,
                        branch
                    },
                    core
                ).then(({ version }) => version)
            )
    );


    const bumpType = NpmModuleVersion.bumpType({
        "versionAheadStr": branchAheadVersion,
        "versionBehindStr": branchBehindVersion || "0.0.0"
    });

    assert(bumpType !== "SAME", "Version is supposed to be updated");


    await st.exec(`git clone https://github.com/${owner}/${repo}`);

    process.chdir(repo);

    await st.exec(`git checkout ${branch_ahead}`);

    const { changelogRaw } = updateChangelog({
        "changelogRaw":
            fs.existsSync("CHANGELOG.md") ?
                fs.readFileSync("CHANGELOG.md")
                    .toString("utf8")
                : ""
        ,
        "version": branchAheadVersion,
        bumpType,
        "body": commits
            .filter(({ commit })=> !exclude_commit_from_author_names.includes(commit.author.name))
            .map(({ commit }) => `- ${commit.message}  `)
            .join("\n")
    });


    core.debug(`CHANGELOG.md: ${changelogRaw}`);


    fs.writeFileSync(
        "CHANGELOG.md",
        Buffer.from(changelogRaw, "utf8")
    );

    await st.exec(`git config --local user.email "${commit_author_email}"`);
    await st.exec(`git config --local user.name "${commit_author_email.split("@")[0]}"`);
    await st.exec(`git add -A`);
    await st.exec(`git commit -am "Update changelog v${branchAheadVersion}"`);

    await gitPush({ owner, repo });

}

function updateChangelog(
    params: {
        changelogRaw: string;
        version: string;
        bumpType: "MAJOR" | "MINOR" | "PATCH";
        body: string;
    }
): { changelogRaw: string; } {

    const { body, version, bumpType } = params;

    const dateString = (() => {

        const now = new Date();

        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
            .toISOString()
            .split("T")[0];

    })();

    const changelogRaw = [
        `${bumpType === "MAJOR" ? "#" : (bumpType === "MINOR" ? "##" : "###")}`,
        ` **${version}** (${dateString})  \n  \n`,
        `${body}  \n  \n`,
        params.changelogRaw
    ].join("");


    return { changelogRaw };

}