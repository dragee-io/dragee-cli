import {type Maybe, none, type Nullable, some} from "./fp/maybe.model.ts";
import {install} from "./install-namespace-asserter.ts";
import type {Result} from "./fp/result.model.ts";
import {Glob} from "bun";
import {config} from './cli.config.ts'
import type { Asserter } from "@dragee-io/type/asserter";

const findAsserterLocally = async (namespace: string): Promise<Maybe<Asserter>> => {
    let glob = new Glob(`index.ts`);

    const scan = glob.scan({
        cwd: `${config.localRegistryPath}/${namespace}-asserter/`,
        absolute: true,
        onlyFiles: true
    });
    let result;
    try{
        result = await scan.next();
    }catch(error){
        result = undefined;
    }

    if (result?.value === undefined) {
        return none();
    }

    const fileName = result.value;
    const asserter = require(fileName).default as Asserter;
    return some(asserter);
}

const installFor = async (namespace: string): Promise<Nullable<Asserter>> => {
    const result: Result<Asserter> = await install(namespace);
    if (result.status !== 'ok') {
        console.log(`Failed to download asserter for namespace: ${namespace}`);
        return null;
    }

    return result.content;
}

export const lookupForAsserters = async (namespaces: string[]): Promise<Asserter[]> => {
    console.log('Looking up for asserters');

    const asserters: Asserter[] = [];

    for (let namespace of namespaces) {
        const foundLocally = await findAsserterLocally(namespace);
        const asserter = await foundLocally.orElse(() => installFor(namespace));
        if(asserter) asserters.push(asserter);
    }

    console.log('List of asserters matching dragees');
    console.table(asserters, ['namespace', 'fileName']);

    return asserters;
};