import {describe, expect, test} from "bun:test";
import {DddAsserter} from "../src/ddd/ddd-asserter.ts";
import type {Dragee} from "../src/dragee.model.ts";

const asserter = DddAsserter.handler

const dragee: Dragee = (name: string, kind_of: string) => ({name, kind_of})

const valueObject: Dragee = (name: string) => dragee(name, 'ddd/value_object')
const entity: Dragee = (name: string) => dragee(name, 'ddd/entity')
const event: Dragee = (name: string) => dragee(name, 'ddd/event')
const service: Dragee = (name: string) => dragee(name, 'ddd/service')
const repository: Dragee = (name: string) => dragee(name, 'ddd/repository')

describe('DDD Asserter', () => {

    test('assert with no dragees', () => {
        const report: Report = asserter([])
        expect(report.pass).toBeTrue()
        expect(report.namespace).toBe('ddd');
    });

    describe('Aggregate Rules', () => {
        const DRAGEE_FIXTURE_AGGREGATE = './ddd/aggregates-rules';

        describe('An aggregate must contain only value objects, entities, or events', () => {
            test('Rule passed', () => {
                const dragees = require(DRAGEE_FIXTURE_AGGREGATE + '/rule-passed.json')
                const report = asserter(dragees)
                expect(report.pass).toBeTrue()
            })
            test('Rule failed', () => {
                const dragees = require(DRAGEE_FIXTURE_AGGREGATE + '/rule-failed.json')
                const report = asserter(dragees)

                expect(report.pass).toBeFalse()
                expect(report.errors).toContain(
                    'The aggregate "AnAggregate" must not have any dependency of type "ddd/service"'
                )
            })
        })
        describe('An aggregate must at least contains one entity', () => {
            test('Rule passed', () => {
                const valueObjectDragee: Dragee = valueObject('AValueObject')
                const entityDragee: Dragee = entity('AEntity')
                const aggregateDragee: Dragee = {
                    name: 'AnAggregate',
                    kind_of: 'ddd/aggregate',
                    depends_on: {
                        'AEntity': ['field'],
                        'AValueObject': ['field'],
                    }
                }

                const report = asserter([valueObjectDragee, entityDragee, aggregateDragee]);

                expect(report.pass).toBeTrue();
            })

            test('Rule failed', () => {
                const valueObjectDragee: Dragee = valueObject('AValueObject')
                const aggregateDragee: Dragee = {
                    name: 'AnAggregate',
                    kind_of: 'ddd/aggregate',
                    depends_on: {
                        'AValueObject': ['field'],
                    }
                }

                const report = asserter([valueObjectDragee, aggregateDragee]);

                expect(report.pass).toBeFalse();
                expect(report.errors).toContain('The aggregate "AnAggregate" must at least contain a "ddd/entity" type dragee')
            })
        })
    })
    describe('Repository Rules', () => {
        const DRAGEE_FIXTURE_REPOSITORY = './ddd/repositories-rules';

        describe('A repository must be called only inside a Service', () => {
            test('Rule passed', () => {
                const dragees = require(DRAGEE_FIXTURE_REPOSITORY + '/repository-rule-passed.json')
                const report = asserter(dragees)
                expect(report.pass).toBeTrue()
            })
            test('Rule failed', () => {
                const dragees = require(DRAGEE_FIXTURE_REPOSITORY + '/repository-rule-failed.json');
                const report = asserter(dragees)

                expect(report.pass).toBeFalse()
                expect(report.errors).toContain(
                    'The repository "ARepository1" must not be a dependency of "ddd/value_object"'
                )
                expect(report.errors).toContain(
                    'The repository "ARepository2" must not be a dependency of "ddd/value_object"'
                )
            })
        })
    })

    describe('Value object rules', () => {
        const DRAGEE_FIXTURE_VALUE_OBJECT = './ddd/value-object-rules';

        describe('Should only contains entities', () => {
            test('Test pass', () => {
                const dragees = require(DRAGEE_FIXTURE_VALUE_OBJECT + '/rule-passed.json')
                const report = asserter(dragees)
                expect(report.pass).toBeTrue();
            })
            test('Test does not pass', () => {
                const dragees = require(DRAGEE_FIXTURE_VALUE_OBJECT + '/rule-failed.json')
                const report = asserter(dragees)

                expect(report.pass).toBeFalse();
                expect(report.errors).toContain('The value object "AValueObject" must not have any dependency of type "ddd/service"')
            })
        })
    })
})