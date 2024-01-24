import {afterEach, describe, expect, test} from "bun:test";

import { toReportFile } from "../src/command.handler";

const expectedResultDirectory = './test/approval/expected-result/';
const testResultFile = './test/approval/test-result/result.json';

afterEach(() => {
    // Currently, there is no existing function in Bun to delete a file.
    Bun.write(testResultFile, '');
})

describe('Should display correct reporting format', () => {
    test('Format with one report', async () => {
        const reportErrors = [{
            namespace: 'ddd', 
            error: 'The aggregate "io.dragee.rules.relation.DrageeOne" must at least contain a "ddd/entity" type dragee'
        }]
        toReportFile(reportErrors, testResultFile)
        
        const expectedReport = await Promise.resolve(Bun.file(expectedResultDirectory+'expected-single.json').text());
        const createdReport = await Promise.resolve(Bun.file(testResultFile).text());

        expect(expectedReport).toEqual(createdReport);  
    })
    test('Format with two reports', async () => {
        const reportErrors = [{
            namespace: 'ddd', 
            error: 'The aggregate "io.dragee.rules.relation.DrageeOne" must at least contain a "ddd/entity" type dragee'
        },
        {
            namespace: 'ddd',
            error: 'The aggregate "io.dragee.annotation.ddd.sample.AnAggregate" must at least contain a "ddd/entity" type dragee'
        }]
        toReportFile(reportErrors, testResultFile);
        
        const expectedReport = await Promise.resolve(Bun.file(expectedResultDirectory+'expected-multiple.json').text());
        const createdReport = await Promise.resolve(Bun.file(testResultFile).text());

        expect(expectedReport).toEqual(createdReport);
        
    })
})

