import {type Maybe, none, some} from "./fp/maybe.model.ts";
import {install} from "./install-namespace-asserter.ts";
import type {Result} from "./fp/result.model.ts";
import {Glob} from "bun";
import {config} from './cli.config.ts'
import type { AssertHandler, Asserter, Namespace } from "@dragee-io/asserter-type";



const findAsserterLocally = async (namespace: Namespace): Promise<Maybe<Asserter>> => {
    let glob = new Glob(`${namespace}.asserter.ts`);

    const scan = glob.scan({
        cwd: config.localRegistryPath+`${namespace}-asserter/`,
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
    const asserterModule = require(fileName);
    const handler: AssertHandler = asserterModule.default.handler;
    return some({namespace, fileName, handler});
}

const installFor = async (namespace: Namespace): Promise<Asserter> => {
    const result: Result<Asserter> = await install(namespace);
    console.log("Result", result)
    if (result.status !== 'ok') {
        console.log(`Failed to download asserter for namespace: ${namespace}`);
        return;
    }

    return result.content;
}

export const lookupForAsserters = async (namespaces: Namespace[]): Promise<Asserter[]> => {
    console.log('Looking up for asserters');

    const asserters: Asserter[] = [];

    for (let namespace of namespaces) {
        const foundLocally = await findAsserterLocally(namespace);
        const asserter = await foundLocally.orElse(() => installFor(namespace));
        asserters.push(asserter);
    }

    console.log('List of asserters matching dragees');
    console.table(asserters, ['namespace', 'fileName']);

    return asserters;
};