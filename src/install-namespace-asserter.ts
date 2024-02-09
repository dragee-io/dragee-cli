import type { Asserter, Namespace } from "@dragee-io/asserter-type";
import type {Result} from "./fp/result.model.ts";
import {ok} from "./fp/result.model.ts";
import {config} from './cli.config.ts'
import {extract} from "tar"
import axios from "axios";

export const install = async (namespace: Namespace): Promise<Result<Asserter>> => {
    
    const fileName = await downloadAsserterAndGetName(namespace, config.localRegistryPath);
    const destinationDirectoryName = removeFileExtension(fileName);
    console.log("filename: ", fileName)
    console.log("destination directory name: ", destinationDirectoryName)
    console.log(`${config.localRegistryPath}${fileName}`)
    const out = await extract({
        file: `${config.localRegistryPath}${destinationDirectoryName}/${fileName}`,
        cwd: `${config.localRegistryPath}${destinationDirectoryName}/`,
        strip:1,
        preserveOwner:true
    })
    console.log("out: ", out)
    const asserter = await import(`${config.localRegistryPath}${destinationDirectoryName}`);
    console.log("asserter: ", asserter)
    return ok({namespace, fileName: 'none', handler: asserter.default.handler});
}


const downloadAsserterAndGetName = async (namespace: string, assertersDirectory: string) => {
    const {data, status} =  await axios.get<any>(
        `https://registry.npmjs.org/@dragee-io/${namespace}-asserter/latest`,
        {
            headers: {
              Accept: 'application/json',
            },
        },
    );
    const fileName =  data.dist.tarball.split('/').pop();
    const directoryName = removeFileExtension(fileName);
    const resp = await axios.get<any>(data.dist.tarball, {
        responseType: 'arraybuffer'
    })
    console.log('asserter directory: ', assertersDirectory)
    console.log("file name: ", fileName)
    Bun.write(`${assertersDirectory}${directoryName}/${fileName}`, resp.data);
    return fileName;
}

const removeFileExtension = (fileName: string) => {
    const splittedFileName = fileName.split(".");
    splittedFileName.pop();

    return splittedFileName.join(".");
}