import { describe, expect, test, spyOn } from "bun:test";
import { buildReports } from "../src/command.handler";
import { JsonReportBuilder, HtmlReportBuilder, MarkdownReportBuilder } from "@dragee-io/report-generator";
import type { Report } from "@dragee-io/asserter-type";

describe('Should display correct reporting format', () => {
    test('Format with one report', async () => {
        const testResultFile = 'test/result';        
        const jsonReportBuilderMock = spyOn(JsonReportBuilder, 'buildReports');
        const htmlReportBuilderMock = spyOn(HtmlReportBuilder, 'buildReports');
        const markdownReportBuilderMock = spyOn(MarkdownReportBuilder, 'buildReports');
    
        const reports: Report[] = [{
            errors: [
                {
                    drageeName: 'io.dragee.rules.relation.DrageeOne',
                    message: 'This aggregate must at least contain a "ddd/entity" type dragee',
                    ruleId: 'ddd/aggregates-allowed-dependencies'
                },{
                    drageeName: 'io.dragee.rules.relation.DrageeTwo',
                    message: 'This aggregate must at least contain a "ddd/entity" type dragee',
                    ruleId: 'ddd/aggregates-allowed-dependencies'
                }
            ],
            namespace: "ddd",
            pass: true,
            stats: {
                rulesCount: 7,
                errorsCount: 2,
                passCount: 5
            }
        },{
            errors: [{
                drageeName: 'DrageeTestError',
                message: 'Test error',
                ruleId: 'test-error'
            }],
            namespace: "test",
            pass: true,
            stats: {
                rulesCount: 5,
                errorsCount: 1,
                passCount: 4
            }
        }];
        buildReports(reports, testResultFile)
        
        expect(jsonReportBuilderMock).toBeCalled();  
        expect(jsonReportBuilderMock).toBeCalledWith(reports, testResultFile);  
        expect(htmlReportBuilderMock).toBeCalled();  
        expect(htmlReportBuilderMock).toBeCalledWith(reports, testResultFile);  
        expect(markdownReportBuilderMock).toBeCalled();  
        expect(markdownReportBuilderMock).toBeCalledWith(reports, testResultFile);  
    })
})

