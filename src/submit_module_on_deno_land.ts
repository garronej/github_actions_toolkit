


import { getActionParamsFactory } from "./inputHelper";
import { setOutputFactory } from "./outputHelper";
import { createOctokit } from "./tools/createOctokit";
import type { Octokit } from "@octokit/rest";
import * as st from "scripting-tools";
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
const urlJoin: typeof import("path").join = require("url-join");
import { assert } from "evt/dist/tools/typeSafety";
import * as is_well_formed_and_available_module_name from "./is_well_formed_and_available_module_name";
import { getCommitAsyncIterableFactory } from "./tools/octokit-addons/getPullRequestAsyncIterable";


export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner",
        "repo",
        "commit_author_email"
    ] as const
});

const deno_website_repo = "deno_website2";
//const denoland= "cahuzacf";
const denoland= "denoland";

export type Params = ReturnType<typeof getActionParams>;

type CoreLike = {
    debug: (message: string) => void;
    warning: (message: string) => void;
};


export const { setOutput } = setOutputFactory<"was_already_published">();

export async function action(
    _actionName: "submit_module_on_deno_land",
    params: Params,
    core: CoreLike
): Promise<Parameters<typeof setOutput>[0]> {

    const { owner, repo, commit_author_email } = params;

    const { is_available_on_deno_land } = await is_well_formed_and_available_module_name.action(
        "is_well_formed_and_available_module_name",
        { "module_name": repo },
        core
    );

    if (!is_available_on_deno_land) {

        const databaseJsonParsed = await fetch(
            urlJoin(
                "https://raw.github.com",
                denoland,
                deno_website_repo,
                "master",
                "src",
                "database.json"
            )
        )
            .then(res => res.text())
            .then(text => JSON.parse(text))
            ;

        const entry = databaseJsonParsed[repo];

        if (entry.owner === owner) {
            core.debug("Module already published");
            return { "was_already_published": "true" };
        }

        throw new Error(`${repo} module name is no longer available, published by someone else`);

    }


    const moduleNameAvailabilityStatus = await checkDenoLandPullRequests({
        "octokit": createOctokit(),
        owner,
        "module_name": repo,
        core
    });

    if (moduleNameAvailabilityStatus === "PENDING SUBMISSION BY USER") {

        core.debug("Pending submission");

        return { "was_already_published": "true" };

    }

    if (moduleNameAvailabilityStatus === "PREVIOUSLY REJECTED SUBMISSION BY USER") {

        throw new Error(`A pull request for adding ${repo} was already issued but not merged, not issuing a new one`);

    }

    if (moduleNameAvailabilityStatus === "PENDING SUBMISSION BY OTHER") {

        core.warning("An other user has already submitted a PR for adding a module with the same name.");

    }

    if( !st.apt_get_install_if_missing.doesHaveProg("hub") ){

        await st.exec("curl -fsSL https://github.com/github/hub/raw/master/script/get | bash -s 2.14.1");

    }


    await st.exec(`hub clone ${denoland}/${deno_website_repo}`);

    const repoPath = path.join(process.cwd(), deno_website_repo);

    try {

        process.chdir(repoPath);

        await st.exec(`git config --local hub.protocol https`);
        await st.exec(`git config --local user.name "${owner}"`);

        const branch = `add_${repo}_third_party_module_${Date.now()}`;

        await st.exec(`git checkout -b ${branch}`);

        const databaseFilePath = path.join("src", "database.json");

        let databaseJsonParsed = JSON.parse(
            fs.readFileSync(databaseFilePath).toString("utf8")
        );

        const moduleNames = Object.keys(databaseJsonParsed);

        if (moduleNames.indexOf(repo) >= 0) {

            throw new Error(`Seems like the module name ${repo} is no longer available`);

        }

        const { desc } = await fetch(
            urlJoin(
                "https://raw.github.com",
                owner,
                repo,
                "master",
                "package.json"
            )
        )
            .then(res => res.text())
            .then(text => JSON.parse(text))
            .then(({ description }) => {

                assert(
                    typeof description === "string",
                    "No description field in package.json"
                );

                return { "desc": description };

            })
            ;

        fs.writeFileSync(
            databaseFilePath,
            Buffer.from(
                JSON.stringify(
                    (() => {

                        const out: Record<string, object> = {};

                        [...moduleNames, repo]
                            .sort()
                            .forEach(
                                moduleName => out[moduleName] =
                                    moduleName !== repo ?
                                        databaseJsonParsed[moduleName] :
                                        {
                                            "type": "github",
                                            owner,
                                            repo,
                                            desc
                                        }
                            )
                            ;

                        return out;


                    })(),
                    null,
                    2
                ) + "\n",
                "utf8"
            )
        );

        const commitMessage = `Adding ${repo} to database.json`;

        await st.exec(`git commit -am "${commitMessage}"`)

        await st.exec(`hub fork --remote-name origin`);

        await st.exec([
            `git remote set-url origin`,
            `https://${owner}:${process.env["GITHUB_TOKEN"]}@github.com/${owner}/${deno_website_repo}.git`,
        ].join(" "));

        await st.exec(`git push origin ${branch}`);

        await st.exec(`hub pull-request -m "` + [
            commitMessage,
            ``,
            `https://github.com/${owner}/${repo}`,
            ``,
            `This is an automatic PR submitted on behalf of u/${owner} by [denoify_ci](https://github.com/garronej/denoify_ci/blob/dev/TEMPLATE_README.md)`
        ].join("\n") + `"`);

        process.chdir(path.join(process.cwd(), ".."));

        await st.exec(`rm -r ${deno_website_repo}`);

        return { "was_already_published": "false" };

    } catch (error) {

        await st.exec(`rm -r ${repoPath}`);

        throw error;

    }

}

async function checkDenoLandPullRequests(params: {
    octokit: Octokit;
    module_name: string;
    owner: string;
    core: CoreLike;
}): Promise<
    "AVAILABLE" |
    "PENDING SUBMISSION BY USER" |
    "PENDING SUBMISSION BY OTHER" |
    "PREVIOUSLY REJECTED SUBMISSION BY USER"
> {

    const { octokit, core } = params;

    core.debug(`Checking ${denoland}/${deno_website_repo} pull requests`);

    const { getCommitAsyncIterable } = getCommitAsyncIterableFactory({ octokit });

    for await (
        const pullRequest
        of
        getCommitAsyncIterable({
            "owner": denoland,
            "repo": deno_website_repo,
            "state": "all",
        })
    ) {

        if (pullRequest.state === "closed" && !!pullRequest.merged_at) {
            continue;
        }

        const database_json_changes = await octokit.pulls.listFiles({
            "owner": denoland,
            "repo": deno_website_repo,
            "pull_number": pullRequest.number,
            "pages": 0
        }).then(
            ({ data }) => data.find(
                ({ filename }) => ( 
                    filename === "src/database.json" ||
                    filename === "database.json"
                )
            )
        );



        if (database_json_changes === undefined) {
            continue;
        }

        const databaseJsonParsed = await fetch(database_json_changes.raw_url)
            .then(res => res.text())
            .then(text => JSON.parse(text))
            .catch(() =>  undefined );
        ;

        if (typeof databaseJsonParsed !== "object") {
            core.debug(`Error parsing database.json for PR n°${pullRequest.number}, skipping`);
            continue;
        }

        if (!(params.module_name in databaseJsonParsed)) {
            continue;
        }

        const entry = databaseJsonParsed[params.module_name];

        if (typeof entry !== "object") {
            core.debug(`Entry malformed for PR n°${pullRequest.number}, skipping`);
            continue;
        }

        const { owner } = entry;

        if (typeof owner !== "string") {
            core.debug(`No owner field, in PR n°${pullRequest.number}, skipping`);
            continue;
        }


        if (owner === params.owner) {

            if (pullRequest.state === "closed") {
                core.debug("Already rejected, not submitting an other one");
                return "PREVIOUSLY REJECTED SUBMISSION BY USER";
            }

            core.debug(`Pull request already opened, pending approval`);

            return "PENDING SUBMISSION BY USER";

        } else {

            if (pullRequest.state === "closed") {
                core.debug("Someone already to submit a module named like that but the PR wasn't merged");

                continue;

            }

            core.debug("Two module with the same name in the race");

            return "PENDING SUBMISSION BY OTHER";


        }

    }

    core.debug(`${params.module_name} is available for submission`);

    return "AVAILABLE";

}