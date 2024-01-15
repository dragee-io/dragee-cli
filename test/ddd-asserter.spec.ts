import {describe, expect, test} from "bun:test";
import {DddAsserter} from "../src/ddd/ddd-asserter.ts";

const asserter = DddAsserter
describe('DDD Asserter', () => {

    test('assert with no dragees', () => {
        const report: Report = asserter([])
        expect(report.pass).toBeTrue()
    });

    describe('Aggregate Rules', () => {
        test('An aggregate must contain only value objects', () => {
            const valueObjectDragee: Dragee = {
                name: 'AValueObject',
                kind_of: 'ddd/value_object',
            }
            const aggregateDragee: Dragee = {
                name: 'AnAggregate',
                kind_of: 'ddd/aggregate',
                depends_on: {
                    'AValueObject': ['field']
                }
            }

            const report = asserter([valueObjectDragee, aggregateDragee])
            expect(report.pass).toBeTrue()
        })
    })
})