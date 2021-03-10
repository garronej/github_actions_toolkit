

import { action } from "../sync_package_and_package_lock_version";

(async () => {

    const repo = "literate-sniffle";

    await action("sync_package_and_package_lock_version", {
        "owner": "garronej",
        repo,
        "branch": "master",
        "commit_author_email": "ts_ci@github.com",
        "github_token": ""
    },
        { "debug": console.log }
    );

})();


