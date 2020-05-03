
import * as st from "scripting-tools";
import * as commentJson from "comment-json";
import * as fs from "fs";
import * as path from "path";
import * as core from '@actions/core'
import glob from "glob";

//TODO !
export async function moveDistFilesToRoot(
    params: Record<
        "move_dist_files_to_root" |
        "remove_sources" |
        "only_include_on_master_branches_the_dist_files_packed_in_the_npm_bundle" |
        "remove_test_files"
        , string
    >
) {

    core.setFailed("Not implemented yet");

    params;

    // /.../dist
    const tsConfigOutDir = path.normalize(
        path.join(
            process.cwd(),
            commentJson.parse(
                fs.readFileSync(
                    path.join(process.cwd(), "./tsconfig.json")
                ).toString("utf8")
            )["compilerOptions"]["outDir"]
        )
    );

    if (tsConfigOutDir === process.cwd()) {

        core.debug("Out dir ir already the root");
        return;

    }


    // /.../deno_dist
    const denoDistPath =
        path.join(
            path.dirname(tsConfigOutDir),
            `deno_${path.basename(tsConfigOutDir)}`
        );

    st.exec(`rsync -a --copy-links ${denoDistPath}/ ${tsConfigOutDir}/ `);

    walk: {

        // [ "/dist/lib", "/src/lib", "/dist/tools", "/src/tools" ]
        const files = JSON.parse(
            fs.readFileSync(
                path.join(
                    process.cwd(),
                    "./package.json"
                )
            ).toString("utf8")
        );

        if (!files) {
            break walk;
        }


        // options is optional
        glob("**/*.js", {}, function (er, files) {
            // files is an array of filenames.
            // If the `nonull` option is set, and nothing
            // was found, then files is ["**/*.js"]
            // er is an error object or null.
        })



    }


}