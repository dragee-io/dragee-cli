import type { Result } from "./fp/result.model.ts";
import { ok } from "./fp/result.model.ts";
import { config } from './cli.config.ts'
import { extract } from "tar"
import { downloadProjectAndGetName, removeVersionAndExtension } from "./services/project.service.ts";
import { unlink } from "node:fs"

export const install = async <T>(projectName: string): Promise<Result<T>> => {    
    const projectFileName = await downloadProjectAndGetName(projectName, config.localRegistryPath);
    const destinationDirectoryName = `${config.localRegistryPath}/${removeVersionAndExtension(projectFileName)}`;
    
    await extract({
        file: `${destinationDirectoryName}/${projectFileName}`,
        cwd: `${destinationDirectoryName}/`,
        strip:1,
        preserveOwner:true,
    })

    const project = (await import(destinationDirectoryName)).default as T;

    unlink(`${destinationDirectoryName}/${projectFileName}`, (err) => {
        if (err) throw err;
        console.log(`${projectFileName} was deleted`);
    });

    return ok(project);
}