
import * as core from '@actions/core'
import { objectKeys } from "evt/dist/tools/typeSafety/objectKeys";

export const outputNames = [
    "version",
    "is_valid_node_module_name",
    "is_valid_deno_module_name",
    "is_available_on_npm",
    "is_available_on_deno_land",
    "was_already_published"
] as const;


export function getOutputDescription(inputName: typeof outputNames[number]): string {
    switch (inputName) {
        case "version": return "Output of get_package_json_version";
        case "is_valid_node_module_name": return "true|false";
        case "is_valid_deno_module_name": return "true|false";
        case "is_available_on_npm": return "true|false";
        case "is_available_on_deno_land": return "true|false";
        case "was_already_published": return "true|false";
    }
}

export function setOutputFactory<U extends typeof outputNames[number]>() {

    function setOutput(outputs: Record<U, string>): void {

        objectKeys(outputs)
            .forEach(outputName => core.setOutput(outputName, outputs[outputName]));

    };

    return { setOutput };

}
