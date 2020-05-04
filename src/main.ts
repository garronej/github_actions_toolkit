import * as core from '@actions/core'
import * as get_package_json_version from "./get_package_json_version";
import * as dispatch_event from "./dispatch_event";
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
      )
      return;
    case "dispatch_event":
      await dispatch_event.action(
        action_name,
        dispatch_event.getActionParams()
      );
      return;
    case "update_changelog": 
        await update_changelog.action(
          action_name,
          update_changelog.getActionParams(),
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

