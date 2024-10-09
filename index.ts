import { Command } from 'commander';
import { reportCommandhandler } from "./src/commands/report-command.handler.ts";
import { drawCommandhandler } from "./src/commands/draw-command.handler.ts";
import { generateAsserter } from "@dragee-io/asserter-generator";
import { generateGrapher } from "@dragee-io/grapher-generator";
   
const report = new Command('report')
    .alias('r')
    .option('--from, --from-dir <path-to-dir>', 'directory in where to lookup for dragees', '.')
    .option('--to --to-dir <path-to-dir>', 'directory in where to store reports', './dragee/reports')
    .action(reportCommandhandler);

const draw = new Command('draw')
    .alias('d')
    .option('--from, --from-dir <path-to-dir>', 'directory in where to lookup for dragees', '.')
    .option('--to --to-dir <path-to-dir>', 'directory in where to store reports', './dragee/reports')
    .action(drawCommandhandler);

new Command()
    .addCommand(generateAsserter)
    .addCommand(generateGrapher)
    .addCommand(report)
    .addCommand(draw)
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse(process.argv);