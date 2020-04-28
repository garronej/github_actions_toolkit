
import * as st from "scripting-tools";
import * as path from "path";
import * as commentJson from "comment-json";
import * as fs from "fs";
import * as core from '@actions/core'

export async function stageDistFiles() {

    // ./dist
    const tsConfigOutDir =
        path.join(
            process.cwd(),
            commentJson.parse(
                fs.readFileSync(
                    path.join(process.cwd(), "./tsconfig.json")
                ).toString("utf8")
            )["compilerOptions"]["outDir"]
        )

    // ./deno_dist
    const denoDistPath =
        path.join(
            path.dirname(tsConfigOutDir),
            `deno_${path.basename(tsConfigOutDir)}`
        )
        ;

    
    const cmd= `git add -f ${tsConfigOutDir} ${denoDistPath}`
    

    core.debug(cmd);

    await st.exec(cmd);

}