import { getActionParamsFactory } from "./inputHelper";
import * as st from "scripting-tools";
import * as fs from "fs";

export const { getActionParams } = getActionParamsFactory({
    "inputNameSubset": [
        "owner",
        "repo",
        "branch",
        "commit_author_email"
    ] as const
});

export type Params = ReturnType<typeof getActionParams>;

type CoreLike = {
    debug: (message: string) => void;
};

export async function action(
    _actionName: "sync_package_and_package_lock_version",
    params: Params,
    core: CoreLike
) {

    const { owner, repo, branch, commit_author_email } = params;

    await st.exec(`git clone https://github.com/${owner}/${repo}`);

    process.chdir(repo);

    await st.exec(`git checkout ${branch}`);


    const { version } = JSON.parse(
        fs.readFileSync("package.json")
            .toString("utf8")
    );

    if (!fs.existsSync("package-lock.json")) {
        core.debug(`No package-lock.json tracked by ${owner}/${repo}#${branch}`);
        return;
    }

    const packageLockJsonParsed = JSON.parse(
        fs.readFileSync("package-lock.json")
            .toString("utf8")
    );

    if (packageLockJsonParsed.version === version) {
        core.debug("Nothing to do, version in package.json and package-lock.json are the same");
    }

    fs.writeFileSync(
        "package-lock.json",
        Buffer.from(
            JSON.stringify(
                (() => {
                    packageLockJsonParsed.version = version;
                    return packageLockJsonParsed;
                })()
            ),
            "utf8"
        )
    );

    await st.exec(`git config --local user.email "${commit_author_email}"`);
    await st.exec(`git config --local user.name "${commit_author_email.split("@")[0]}"`);
    await st.exec(`git commit -am "Sync package.json and package.lock version"`);
    await st.exec(`git push`);

}
