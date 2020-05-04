
import { getActionParamsFactory } from "./inputHelper";
import * as st from "scripting-tools";
import { getChangeLogFactory } from "./tools/octokit-addons/getChangeLog";
import { Octokit } from "@octokit/rest";
import * as get_package_json_version from "./get_package_json_version";
import * as fs from "fs";
import { NpmModuleVersion } from "./tools/NpmModuleVersion";
import { assert } from "evt/dist/tools/typeSafety";

export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner",
        "repo",
        "branch_behind",
        "branch_ahead",
        "commit_author_name"
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

    const { owner, repo, branch_ahead, branch_behind, commit_author_name } = params;



    const octokit = new Octokit();

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
            .map(({ commit }) => `- ${commit.message}  `)
            .join("\n")
    });


    core.debug(`CHANGELOG.md: ${changelogRaw}`);


    fs.writeFileSync(
        "CHANGELOG.md",
        Buffer.from(changelogRaw, "utf8")
    );

    await st.exec(`git config --local user.email "${commit_author_name}@github.com"`);
    await st.exec(`git config --local user.name "${commit_author_name}"`);
    await st.exec(`git add -A`);
    await st.exec(`git commit -am "Update changelog v${branchAheadVersion}"`);
    await st.exec(`git push`);

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