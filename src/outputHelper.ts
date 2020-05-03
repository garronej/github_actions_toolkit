
import * as core from '@actions/core'
import {objectKeys} from "evt/dist/tools/typeSafety/objectKeys";

export const outputNames = [
    "is_version_changed"
] as const;


export function getOutputDescription(inputName: typeof outputNames[number]): string {
    switch(inputName){
        case "is_version_changed": return "'true' if version changed 'false' otherwise"
    }
}

export function setOutputFactory<U extends typeof outputNames[number]>() {

    function setOutput(outputs: Record<U, string>): void {

        objectKeys(outputs)
            .forEach(outputName => core.setOutput(outputName, outputs[outputName]));

    };

    return { setOutput };

}
