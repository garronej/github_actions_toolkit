
import { action } from "../update_changelog";

action("update_changelog", {
    "owner": "garronej",
    "repo": "test-repo",
    "branch_behind": "master",
    "branch_ahead": "dev",
    "commit_author_name": "action"
},
    { "debug": console.log }
);