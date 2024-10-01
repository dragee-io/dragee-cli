import { lookupForDragees } from "../dragee-lookup.ts";
import { lookupForNamespaces } from "../namespace-lookup.ts";
import { lookupForAsserters } from "../namespace-asserter-lookup.ts";
import { type Asserter, type Report, asserterHandler } from "@dragee-io/type/asserter";
import { JsonReportBuilder, HtmlReportBuilder, MarkdownReportBuilder } from "@dragee-io/report-generator";

type Options = {
    fromDir: string,
    toDir: string
}

export const reportCommandhandler = async ({fromDir, toDir}: Options) => {
    const dragees = await lookupForDragees(fromDir);
    const namespaces = await lookupForNamespaces(dragees);
    const asserters: Asserter[] = await lookupForAsserters(namespaces);
    const reports: Report[] = [];
    
    for (const asserter of asserters) {
        console.log(`Running asserter for namespace ${asserter.namespace}`)
        reports.push(asserterHandler(asserter, dragees));
    }
    
    buildReports(reports, toDir + '/result');
}

export const buildReports = (reports: Report[], filePath: string) => {
    JsonReportBuilder.buildReports(reports, filePath);
    HtmlReportBuilder.buildReports(reports, filePath);
    MarkdownReportBuilder.buildReports(reports, filePath);
}
