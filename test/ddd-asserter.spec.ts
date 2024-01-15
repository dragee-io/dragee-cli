import {describe, expect, test} from "bun:test";
import {DddAsserter} from "../src/ddd/ddd-asserter.ts";

const asserter = DddAsserter
describe('DDD Asserter', () => {

    test('assert with no dragees', () => {
        const report: Report = asserter([])
        expect(report.pass).toBeTrue()
    });

    
})