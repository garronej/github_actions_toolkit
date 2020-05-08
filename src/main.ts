import * as core from '@actions/core'
import * as get_package_json_version from "./get_package_json_version";
import * as dispatch_event from "./dispatch_event";
import * as sync_package_and_package_lock_version from "./sync_package_and_package_lock_version";
import { getActionName } from "./inputHelper";
import * as update_changelog from "./update_changelog";

async function run(): Promise<void> {

  core.debug("Hey the text");

  const action_name = getActionName();

  switch (action_name) {
    case "get_package_json_version":
      get_package_json_version.setOutput(
        await get_package_json_version.action(
          action_name,
          get_package_json_version.getActionParams(),
          core
        )
      )
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

