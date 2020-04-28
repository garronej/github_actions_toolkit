import * as core from '@actions/core'
import { updateProtectedBranchRequiredStatusChecks } from "./updateProtectedBranchRequiredStatusChecks";
import { checkVersionNumberUpdated } from "./checkVersionNumberUpdated";
import { moveDistFilesToRoot } from "./structuralChanges";
import { stageDistFiles } from "./stageDistFiles";

const inputsNames = [
  "action_name",

  "repository",
  "branch",
  "github_token",
  "repository_owner",
  "required_status_checks_json",

  "move_dist_files_to_root",
  "remove_sources",
  "only_include_on_master_branches_the_dist_files_packed_in_the_npm_bundle",
  "remove_test_files"

] as const;

const getInput = (inputName: typeof inputsNames[number]) => {

  if (inputsNames.indexOf(inputName) < 0) {
    throw new Error(`${inputName} expected`);
  }

  return core.getInput(inputName);

}

const getParams = <U extends typeof inputsNames[number]>(arr: readonly U[]) => {

  const params: Record<U, string> = {} as any;

  arr.forEach(inputName => params[inputName] = getInput(inputName));

  return params;

}

async function run(): Promise<void> {

  core.debug("In run!");

  switch (getInput("action_name")) {
    case "update_protected_branch_required_status_checks": await updateProtectedBranchRequiredStatusChecks(
      getParams([
        "repository",
        "repository_owner",
        "github_token",
        "branch",
        "required_status_checks_json"
      ])
    ); break;
    case "check_version_number_updated": await checkVersionNumberUpdated(
      getParams(["repository"])
    ); break;
    case "structural_changes": await moveDistFilesToRoot(
      getParams([
        "move_dist_files_to_root",
        "remove_sources",
        "only_include_on_master_branches_the_dist_files_packed_in_the_npm_bundle",
        "remove_test_files"
      ])
    ); break;
    case "stage_dist_files": await stageDistFiles();
    default:
      const name = "action_name";
      throw new Error(`${name} ${getInput(name)} not supported`);
  }

}

(async () => {

  try {

    await run()

  } catch (error) {
    core.setFailed(error.message);
  }

})();

