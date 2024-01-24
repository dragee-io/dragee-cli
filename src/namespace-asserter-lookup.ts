import {type Maybe, none, some} from "./fp/maybe.model.ts";
import {install} from "./install-namespace-asserter.ts";
import type {Result} from "./fp/result.model.ts";
import {Glob} from "bun";
import {config} from './cli.config.ts'
import type {Asserter, AssertHandler, Namespace} from "./dragee.model.ts";

const findAsserterLocally = async (namespace: Namespace): Promise<Maybe<Asserter>> => {
    const glob = new Glob(`${namespace}.asserter.ts`);
    const scan = glob.scan({
        cwd: config.localRegistryPath,
        absolute: true,
        onlyFiles: true
    });

    const result = await scan.next();

    if (result.value === undefined) {
        return none();
    }

    const fileName = result.value;
    const asserterModule = require(fileName);
    const handler: AssertHandler = asserterModule.default;
    return some({namespace, fileName, handler});
}

const installFor = async (namespace: Namespace): Promise<Maybe<Asserter>> => {
    const result: Result<Asserter> = await install(namespace);

    if (result.status !== 'ok') {
        console.log(`Failed to download asserter for namespace: ${namespace}`);
        return none();
    }

    return some(result.content);
}

export const lookupForAsserters = async (namespaces: Namespace[]): Promise<Asserter[]> => {
    console.log('Looking up for asserters');

    const asserters: Asserter[] = [];

    for (let namespace of namespaces) {
        const foundLocally = await findAsserterLocally(namespace);
        const maybeAsserter = await foundLocally.orElseGet(() => installFor(namespace));
        maybeAsserter.ifPresent(a => asserters.push(a));
    }

    console.log('List of asserters matching dragees');
    console.table(asserters, ['namespace', 'fileName']);

    return asserters;
};