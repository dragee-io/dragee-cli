import {lookupForDragees} from "./dragee-lookup.ts";
import {lookupForNamespaces} from "./namespace-lookup.ts";
import {lookupForAsserters} from "./namespace-asserter-lookup.ts";
import type {Asserter} from "./dragee.model.ts";

type Options = {
    fromDir: string,
    toDir: string
}

export const handler = async (argument: string, options: Options) => {
    const dragees = await lookupForDragees(options.fromDir);
    const namespaces = await lookupForNamespaces(dragees);
    const asserters: Asserter[] = await lookupForAsserters(namespaces);

    for (const {namespace, handler: process} of asserters) {
        console.log(`Running asserter for namespace ${namespace}`)
        process(dragees);
    }
}