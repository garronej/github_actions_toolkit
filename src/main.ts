import * as core from '@actions/core'
import * as is_version_changed from "./is_version_changed";
import * as dispatch_event from "./dispatch_event";
import { getActionName } from "./inputHelper";

async function run(): Promise<void> {

  const action_name = getActionName();

  switch (action_name) {
    case "is_version_changed":
      await is_version_changed.action(
        action_name,
        is_version_changed.getActionParams(),
        core
      );
      break;
    case "dispatch_event":
      await dispatch_event.action(
        action_name,
        dispatch_event.getActionParams()
      );
      break;
    default:
      throw new Error(`${action_name} Not supported`);
  }

}

(async () => {

  try {

    await run()

  } catch (error) {
    core.setFailed(error.message);
  }

})();

