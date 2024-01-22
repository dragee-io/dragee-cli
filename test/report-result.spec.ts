import {afterEach, describe, expect, test} from "bun:test";
import fs from 'fs'
import { toReportFile } from "../src/command.handler";

const expectedResultDirectory = process.cwd()+'/test/approval/expected-result/';
const testResultFile = process.cwd()+'/test/approval/test-result/result.json';

afterEach(() => {
    fs.unlinkSync(testResultFile);
})

describe('Should display correct reporting format', () => {
    test('Format with one report', () => {
        const reportErrors = [{
            namespace: 'ddd', 
            error: 'The aggregate "io.dragee.rules.relation.DrageeOne" must at least contain a "ddd/entity" type dragee'
        }]
        toReportFile(reportErrors, testResultFile)
        
        const expectedReport = fs.readFileSync(expectedResultDirectory+'expected-single.json')
        const createdReport = fs.readFileSync(testResultFile)

        expect(expectedReport.equals(createdReport) ).toBeTrue();
    })
    test('Format with two reports', () => {
        const reportErrors = [{
            namespace: 'ddd', 
            error: 'The aggregate "io.dragee.rules.relation.DrageeOne" must at least contain a "ddd/entity" type dragee'
        },
        {
            namespace: 'ddd',
            error: 'The aggregate "io.dragee.annotation.ddd.sample.AnAggregate" must at least contain a "ddd/entity" type dragee'
        }]
        toReportFile(reportErrors, testResultFile)
        
        const expectedReport = fs.readFileSync(expectedResultDirectory+'expected-multiple.json')
        const createdReport = fs.readFileSync(testResultFile)

        expect(expectedReport.equals(createdReport) ).toBeTrue();
    })
})

