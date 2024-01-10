import {Maybe, some} from "./fp/maybe.model.ts";
import {install} from "./install-namespace-asserter.ts";
import type {Result} from "./fp/result.model.ts";

const findAsserterLocally = async (namespace: Namespace): Promise<Maybe<Asserter>> => {
    // return none();
    return some((dragees) => `not implemented yet for namespace: ${namespace}`);
}

const installFor = async (namespace: Namespace): Promise<Asserter> => {
    const result: Result<Asserter> = await install(namespace);

    if (result.status !== 'ok') {
        console.log(`Failed to download asserter for namespace: ${namespace}`);
        return;
    }

    return result.content;
}

export const lookupForAsserters = async (namespaces: Namespace[]): Promise<Asserter[]> => {
    console.log('Looking up for asserters');

    const asserters = [];

    for (let namespace of namespaces) {
        const foundLocally = await findAsserterLocally(namespace);
        const asserter = await foundLocally.orElse(() => installFor(namespace));
        asserters.push(asserter);
    }

    return asserters.map(asserter => asserter());
};