import type { Asserter } from "@dragee-io/type/asserter";
import type { Result } from "./fp/result.model.ts";
import { ok } from "./fp/result.model.ts";
import { config } from './cli.config.ts'
import { extract } from "tar"
import { downloadAsserterAndGetName, removeVersionAndExtension } from "./services/asserter.service.ts";
import { unlink } from "node:fs"

export const install = async (namespace: string): Promise<Result<Asserter>> => {    
    const asserterName = await downloadAsserterAndGetName(namespace, config.localRegistryPath);
    const destinationDirectoryName = `${config.localRegistryPath}/${removeVersionAndExtension(asserterName)}`;
    
    await extract({
        file: `${destinationDirectoryName}/${asserterName}`,
        cwd: `${destinationDirectoryName}/`,
        strip:1,
        preserveOwner:true,
    })

    const asserter = (await import(destinationDirectoryName)).default as Asserter;

    unlink(`${destinationDirectoryName}/${asserterName}`, (err) => {
        if (err) throw err;
        console.log(`${asserterName} was deleted`);
    });

    return ok(asserter);
}