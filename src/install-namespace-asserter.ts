import type { Asserter, Namespace } from "@dragee-io/asserter-type";
import type {Result} from "./fp/result.model.ts";
import {ok} from "./fp/result.model.ts";

export const install = async (namespace: Namespace): Promise<Result<Asserter>> => {
    console.log("try to install")
    Bun.spawnSync(["bun", "install", "@dragee-io/ddd-asserter"]);
    const asserter = await import(`@dragee-io/${namespace}-asserter`);
    return ok({namespace, fileName: 'none', handler: asserter.default.handler});
}