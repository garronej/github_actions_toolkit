import * as core from '@actions/core'
import * as get_package_json_version from "./get_package_json_version";
import * as dispatch_event from "./dispatch_event";
import * as sync_package_and_package_lock_version from "./sync_package_and_package_lock_version";
import * as setup_repo_webhook_for_deno_land_publishing from "./setup_repo_webhook_for_deno_land_publishing";
import * as is_well_formed_and_available_module_name from "./is_well_formed_and_available_module_name";
import * as string_replace from "./string_replace";
import { getActionName } from "./inputHelper";
import * as update_changelog from "./update_changelog";

async function run(): Promise<void> {

    const action_name = getActionName();

    switch (action_name) {
        case "get_package_json_version":
            get_package_json_version.setOutput(
                await get_package_json_version.action(
                    action_name,
                    get_package_json_version.getActionParams(),
                    core
                )
            );
            return;
        case "dispatch_event":
            await dispatch_event.action(
                action_name,
                dispatch_event.getActionParams(),
                core
            );
            return;
        case "update_changelog":
            await update_changelog.action(
                action_name,
                update_changelog.getActionParams(),
                core
            );
            return;
        case "sync_package_and_package_lock_version":
            await sync_package_and_package_lock_version.action(
                action_name,
                sync_package_and_package_lock_version.getActionParams(),
                core
            );
            return;
        case "setup_repo_webhook_for_deno_land_publishing":
            await setup_repo_webhook_for_deno_land_publishing.action(
                action_name,
                setup_repo_webhook_for_deno_land_publishing.getActionParams(),
                core
            );
            return;
        case "is_well_formed_and_available_module_name":
            is_well_formed_and_available_module_name.setOutput(
                await is_well_formed_and_available_module_name.action(
                    action_name,
                    is_well_formed_and_available_module_name.getActionParams(),
                    core
                )
            );
            return;
        case "string_replace":
            string_replace.setOutput(
                await string_replace.action(
                    action_name,
                    string_replace.getActionParams(),
                    core
                )
            );
            return;
    }

    throw new Error(`${action_name} Not supported by this toolkit`);

}

(async () => {

    try {

        await run()

    } catch (error) {
        core.setFailed(error.message);
    }

})();

