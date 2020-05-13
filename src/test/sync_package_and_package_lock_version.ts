

import { action } from "../sync_package_and_package_lock_version";

(async () => {

    const repo = "super_waffle";

    await action("sync_package_and_package_lock_version", {
        "owner": "garronej",
        repo,
        "branch": "dev",
        "commit_author_email": "denoify_ci@github.com"
    },
        { "debug": console.log }
    );

})();


