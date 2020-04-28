
import fetch from "node-fetch";
export const urlJoin: typeof import("path").join = require("url-join");
import * as core from '@actions/core'

export async function checkVersionNumberUpdated(params: Record<"repository", string>) {

    core.debug("On est là");

    core.warning("ok this is a warning");

    const { repository } = params;

    let version: string;

    try{ 

        version = require("./package.json").version;

    }catch(error){

            core.debug("==========>" + error.message);

            version = "0.0.0";

    }

    core.debug("version: " + version);

    const latest_version_deployed = await fetch(
        urlJoin(
            "https://raw.github.com",
            repository,
            "master",
            "package.json"
        )
    )
        .then(res => res.text())
        .then(text => JSON.parse(text))
        .then(({ version }) => version as string)
        .catch(() => undefined)
        ;

    if (latest_version_deployed === undefined) {

        core.debug("No version of the module have been deployed yet");

        return;

    }

    if (latest_version_deployed === version) {

        core.setFailed("The package.json need to be updated");

        return;

    }

    core.debug(`Ok ${latest_version_deployed} -> ${version}`);

}