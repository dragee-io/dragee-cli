import {describe, expect, test} from "bun:test";
import {DddAsserter} from "../src/ddd/ddd-asserter.ts";

const asserter = DddAsserter
describe('DDD Asserter', () => {

    test('assert with no dragees', () => {
        const report: Report = asserter([])
        expect(report.pass).toBeTrue()
    });

    describe('Aggregate Rules', () => {
        describe('An aggregate must contain only value objects and/or entities', () => {
            test('Rule passed', () => {
                const valueObjectDragee: Dragee = {
                    name: 'AValueObject',
                    kind_of: 'ddd/value_object',
                }
                const entityDragee: Dragee = {
                    name: 'AEntity',
                    kind_of: 'ddd/entity',
                }
                const aggregateDragee: Dragee = {
                    name: 'AnAggregate',
                    kind_of: 'ddd/aggregate',
                    depends_on: {
                        'AEntity': ['field'],
                        'AValueObject': ['field'],
                    }
                }

                const report = asserter([valueObjectDragee, entityDragee, aggregateDragee])
                expect(report.pass).toBeTrue()
            })
            test('Rule failed', () => {
                const serviceDragee: Dragee = {
                    name: 'AService',
                    kind_of: 'ddd/service',
                }
                const aggregateDragee: Dragee = {
                    name: 'AnAggregate',
                    kind_of: 'ddd/aggregate',
                    depends_on: {
                        'AService': ['field']
                    }
                }

                const report = asserter([serviceDragee, aggregateDragee])
                console.log(report)
                expect(report.pass).toBeFalse()
                expect(report.errors).toContain(
                    'The aggregate "AnAggregate" must not have any dependency of type "ddd/service"'
                )
            })
        })
    })
})