import type { Asserter, Namespace } from "@dragee-io/asserter-type";
import type {Result} from "./fp/result.model.ts";
import {ok} from "./fp/result.model.ts";
import {config} from './cli.config.ts'
import {extract} from "tar"
import { downloadAsserterAndGetName, removeVersionAndExtension } from "./services/asserter.service.ts";

export const install = async (namespace: Namespace): Promise<Result<Asserter>> => {
    
    const asserterName = await downloadAsserterAndGetName(namespace, config.localRegistryPath);
    const destinationDirectoryName = config.localRegistryPath + removeVersionAndExtension(asserterName);
    
    await extract({
        file: `${destinationDirectoryName}/${asserterName}`,
        cwd: `${destinationDirectoryName}/`,
        strip:1,
        preserveOwner:true
    })
    
    const asserter = await import(destinationDirectoryName);

    return ok({namespace, fileName: 'none', handler: asserter.default.handler});
}
