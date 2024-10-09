import { Glob } from 'bun';
import { config } from './cli.config.ts';
import { type Maybe, type Nullable, none, some } from './fp/maybe.model.ts';
import type { Result } from './fp/result.model.ts';
import { install } from './install-namespace-project.ts';

const findProjectLocally = async <T>(projectName: string): Promise<Maybe<T>> => {
    const glob = new Glob(`index.ts`);

    const scan = glob.scan({
        cwd: `${config.localRegistryPath}/${projectName}/`,
        absolute: true,
        onlyFiles: true
    });
    let result;
    try {
        result = await scan.next();
    } catch (error) {
        result = undefined;
    }

    if (result?.value === undefined) {
        return none();
    }

    const fileName = result.value;
    const project = require(fileName).default as NonNullable<T>;
    return some(project);
};

const installFor = async <T>(projectName: string): Promise<Nullable<T>> => {
    const result: Result<T> = await install(projectName);
    if (result.status !== 'ok') {
        console.log(`Failed to download project for namespace: ${projectName}`);
        return null;
    }

    return result.content;
};

export const lookupForProjects = async <T>(projectNames: string[]): Promise<T[]> => {
    console.log('Looking up for projects');

    const projects: T[] = [];

    for (const projectName of projectNames) {
        const foundLocally = await findProjectLocally(projectName);
        const project = await foundLocally.orElse(() => installFor(projectName));
        if (project) projects.push(project as NonNullable<T>);
    }

    console.log('List of projects matching dragees');
    console.table(projects, ['projectName', 'fileName']);

    return projects;
};
