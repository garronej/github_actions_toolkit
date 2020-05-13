
import { action } from "../submit_module_on_deno_land";
import * as st from "scripting-tools";

(async () => {

    st.enableCmdTrace();

    const repo = "psychic_carnival";

    const out= await action("submit_module_on_deno_land", {
        "commit_author_email": "denoify_ci@github.com",
        "owner": "garronej",
        repo,
    },
        { 
            "debug": console.log,
            "warning": console.warn
        }
    );

    console.log(out);


})();