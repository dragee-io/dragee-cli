import type { Asserter, Report } from "@dragee-io/asserter-type";
import type {Result} from "./fp/result.model.ts";

export const processAsserters = async (asserters: Asserter[]): Promise<Result<Report>[]> => {
    return [];
}