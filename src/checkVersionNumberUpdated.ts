
import fetch from "node-fetch";
export const urlJoin: typeof import("path").join = require("url-join");
import * as core from '@actions/core'
import * as st from "scripting-tools";

export async function checkVersionNumberUpdated(params: Record<"repository", string>) {

    const { repository } = params;

    core.warning("ok this is a warning: process.cwd" + process.cwd() );

    const out= await st.exec("ls -lR");

    core.debug("ls -lR: " + out);

    const { version } = require("./package.json").version;


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