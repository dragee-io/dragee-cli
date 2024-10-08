import os from 'os'
import path from 'node:path'

type Config = {
    rootPath: string,
    localRegistryPath: string,
    projectsRegistryUrl: string
}

const rootPath = path.join(os.homedir(), '.dragee');

export const config: Config = {
    rootPath: rootPath,
    localRegistryPath: process.env.DRAGEE_ASSERTER_LOCAL_REGISTRY_PATH ?? path.join(rootPath, 'registry'),
    projectsRegistryUrl: 'https://registry.npmjs.org/@dragee-io'
}