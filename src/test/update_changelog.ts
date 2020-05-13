
import { action } from "../update_changelog";
import * as st from "scripting-tools";

(async () => {

    st.enableCmdTrace();

    const repo = "sturdy_umbrella";

    await action("update_changelog", {
        "owner": "garronej",
        repo,
        "branch_behind": "master",
        "branch_ahead": "dev",
        "commit_author_email": "denoify_ci@github.com",
        "exclude_commit_from_author_names_json": JSON.stringify(["denoify_ci"])
    },
        { "debug": console.log }
    );


})();