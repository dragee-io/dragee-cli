import {Glob} from "bun";
import {ko, ok, type Result} from "./fp/result.model.ts";
import type {Dragee} from "./dragee.model.ts";

const readJson = async <T>(fileName: string): Promise<Result<T>> => {
    try {
        const file = Bun.file(fileName);
        const content = await file.json();
        return ok(content);
    } catch (error) {
        return ko(error);
    }
}

const readDragees = async (fromDir: string, glob: Glob) => {
    const scan = glob.scan({
        cwd: fromDir,
        absolute: true,
        onlyFiles: true
    });

    const foundDragees: Dragee[] = [];

    for await (const fileName of scan) {
        const result: Result<Dragee> = await readJson(fileName);

        if (result.status !== 'ok' || !result.content.kind_of) {
            continue;
        }
        foundDragees.push(result.content);
    }

    return foundDragees;
}

export const lookupForDragees = async (fromDir: string) => {
    console.log(`Looking up for dragees in directory: ${fromDir}`);
    return readDragees(fromDir, new Glob("**/*.json"));
}