
import { action } from "../submit_module_on_deno_land";
import * as st from "scripting-tools";

(async () => {

    st.enableCmdTrace();

    const repo = "psychic_carnival";

    process.env["DENO_WEBSITE_REPO_OWNER"]= "cahuzacf";

    const out= await action("submit_module_on_deno_land", {
        "owner": "garronej",
        repo,
        "default_version": "master"
    },
        { 
            "debug": console.log,
            "warning": console.warn
        }
    );

    console.log(out);


})();