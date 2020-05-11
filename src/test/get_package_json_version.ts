


import { action } from "../get_package_json_version";
import * as st from "scripting-tools";

(async () => {

    const cwd = process.cwd();

    const repo = "congenial_pancake";

    const { version } = await action("get_package_json_version", {
        "owner": "garronej",
        repo,
        "branch": "969297e9b5dcd934d57921a363106e5ff45881c0"
    }, { "debug": console.log });

    console.log({ version });

    process.chdir(cwd);

    await st.exec(`rm -rf ${repo}`);

})();


