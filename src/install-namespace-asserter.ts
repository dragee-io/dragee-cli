import type { Asserter, Namespace } from "@dragee-io/asserter-type";
import type {Result} from "./fp/result.model.ts";
import {ok} from "./fp/result.model.ts";

export const install = async (namespace: Namespace): Promise<Result<Asserter>> => {
    console.log("try to install")
    const proc = Bun.spawn(["bun", "install", "@dragee-io/ddd-asserter"]);

    const text = await new Response(proc.stdout).text();
    const asserter = await import("@dragee-io/ddd-asserter");
    console.log('Imported asserter: ', asserter);
    return ok({namespace, fileName: 'none', handler: dragees => 'not implemented yet'});
}