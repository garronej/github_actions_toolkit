
import { action } from "../update_changelog";

action("update_changelog", {
    "owner": "garronej",
    "repo": "test-repo",
    "branch_behind": "master",
    "branch_ahead": "dev",
    "commit_author_email": "denoify_ci@github.com",
    "exclude_commit_from_author_names_json": JSON.stringify([])
},
    { "debug": console.log }
);