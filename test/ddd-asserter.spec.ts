import {describe, expect, test} from "bun:test";
import {DddAsserter} from "../src/ddd/ddd-asserter.ts";
import type {Dragee} from "../src/dragee.model.ts";

const asserter = DddAsserter.handler

const dragee: Dragee = (name: string, kind_of: string) => ({name, kind_of})

const valueObject: Dragee = (name: string) => dragee(name, 'ddd/value_object')
const entity: Dragee = (name: string) => dragee(name, 'ddd/entity')

interface TestObject {
    dragees: Dragee[],
    result: {
        pass: boolean,
        errors: string[],
    },
}

function rulePassed(drageeDirectory: string) {
    test('Rule passed', () => {
        const data: TestObject = require(drageeDirectory)
        const report = asserter(data.dragees)
        expect(report.pass).toBe(data.result.pass)
    })
}

function ruleFailed(drageeDirectory: string) {
    test('Rule failed', () => {
        const data: TestObject = require(drageeDirectory)
        const report = asserter(data.dragees)

        expect(report.pass).toBe(data.result.pass)
        data.result.errors.forEach(error => {
            expect(report.errors).toContain(error)
        })
    })
}

describe('DDD Asserter', () => {

    test('assert with no dragees', () => {
        const report: Report = asserter([])
        expect(report.pass).toBeTrue()
        expect(report.namespace).toBe('ddd');
    });

    describe('Aggregate Rules', () => {
        const AGGREGATE_DEPENDENCY_DRAGEE_TEST_DIRECTORY = './ddd/aggregates-dependencies-rules';
        const AGGREGATE_MANDATORY_DRAGEE_TEST_DIRECTORY = './ddd/aggregates-mandatories-rules';

        describe('An aggregate must contain only value objects, entities, or events', () => {
            rulePassed(AGGREGATE_DEPENDENCY_DRAGEE_TEST_DIRECTORY + '/rule-passed.json');
            ruleFailed(AGGREGATE_DEPENDENCY_DRAGEE_TEST_DIRECTORY + '/rule-failed.json');
        })
        describe('An aggregate must at least contains one entity', () => {
            rulePassed(AGGREGATE_MANDATORY_DRAGEE_TEST_DIRECTORY + '/rule-passed.json');
            ruleFailed(AGGREGATE_MANDATORY_DRAGEE_TEST_DIRECTORY + '/rule-failed.json');
        })
    })
    describe('Repository Rules', () => {
        const REPOSITORY_DRAGEE_TEST_DIRECTORY = './ddd/repositories-rules';

        describe('A repository must be called only inside a Service', () => {
            rulePassed(REPOSITORY_DRAGEE_TEST_DIRECTORY + '/rule-passed.json')
            ruleFailed(REPOSITORY_DRAGEE_TEST_DIRECTORY + '/rule-failed.json')
        })
    })

    describe('Value object rules', () => {
        const VALUE_OBJECT_DRAGEE_DIRECTORY = './ddd/value-object-rules';

        describe('Should only contains entities', () => {
            rulePassed(VALUE_OBJECT_DRAGEE_DIRECTORY + '/rule-passed.json')
            ruleFailed(VALUE_OBJECT_DRAGEE_DIRECTORY + '/rule-failed.json')
        })
    })

    describe('Service rules', () => {
        const SERVICE_DRAGEE_DIRECTORY = './ddd/services-rules';
        describe('Should only contains repositories, entities or value object', () => {
            rulePassed(SERVICE_DRAGEE_DIRECTORY + '/rule-passed.json')
            ruleFailed(SERVICE_DRAGEE_DIRECTORY + '/rule-failed.json')
        })
    })

    describe('Factory rules', () => {
        const FACTORY_DRAGEE_DIRECTORY = './ddd/factories-rules';
        describe('Should only contains entities, value objects or aggregates', () => {
            rulePassed(FACTORY_DRAGEE_DIRECTORY + '/rule-passed.json')
            ruleFailed(FACTORY_DRAGEE_DIRECTORY + '/rule-failed.json')
        })
    })
})