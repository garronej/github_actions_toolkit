

import { action } from "../sync_package_and_package_lock_version";
import * as st from "scripting-tools";

(async () => {

    const cwd = process.cwd();

    const repo = "friendly_memory";

    await action("sync_package_and_package_lock_version", {
        "owner": "garronej",
        repo,
        "branch": "dev",
        "commit_author_email": "denoify_ci@github.com"
    },
        { "debug": console.log }
    );

    process.chdir(cwd);

    await st.exec(`rm -rf ${repo}`);

})();


