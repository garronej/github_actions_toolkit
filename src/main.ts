import * as core from '@actions/core'
import * as get_package_json_version from "./get_package_json_version";
import * as dispatch_event from "./dispatch_event";
import * as sync_package_and_package_lock_version from "./sync_package_and_package_lock_version";
import * as submit_module_on_deno_land from "./submit_module_on_deno_land";
import * as is_well_formed_and_available_module_name from "./is_well_formed_and_available_module_name";
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
        case "submit_module_on_deno_land":
            submit_module_on_deno_land.setOutput(
                await submit_module_on_deno_land.action(
                    action_name,
                    submit_module_on_deno_land.getActionParams(),
                    core
                )
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
    }

    throw new Error(`${action_name} Not supported`);

}

(async () => {

    try {

        await run()

    } catch (error) {
        core.setFailed(error.message);
    }

})();

