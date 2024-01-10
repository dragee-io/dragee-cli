import type {Result} from "./fp/result.model.ts";
import {ok} from "./fp/result.model.ts";

export const install = async (namespace: Namespace): Promise<Result<Asserter>> => {
    return ok(dragees => 'not implemented yet');
}