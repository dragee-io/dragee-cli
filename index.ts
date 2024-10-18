import { generateAsserter } from '@dragee-io/asserter-generator';
import { generateGrapher } from '@dragee-io/grapher-generator';
import { Command } from 'commander';
import { drawCommandhandler } from './src/commands/draw-command.handler.ts';
import { reportCommandhandler } from './src/commands/report-command.handler.ts';

const report = new Command('report')
    .alias('r')
    .summary('builds asserters rules report')
    .description(
        'Builds asserters rules report.\n' +
            '- Lookups dragees in [--from-dir] directory\n' +
            '- Downloads asserters for dragees namespaces\n' +
            '- Executes rules from asserters\n' +
            '- Builds reports in [--to-dir] directory'
    )
    .option('--from, --from-dir <path-to-dir>', 'directory in where to lookup for dragees', '.')
    .option(
        '--to --to-dir <path-to-dir>',
        'directory in where to store reports',
        './dragee/reports'
    )
    .action(reportCommandhandler);

const draw = new Command('draw')
    .alias('d')
    .summary('builds graphers graphs models')
    .description(
        'Builds graphers graphs models.\n' +
            '- Lookups dragees in [--from-dir] directory\n' +
            '- Downloads graphers for dragees namespaces\n' +
            '- Executes graphs from graphers\n' +
            '- Draws models in [--to-dir] directory'
    )
    .option('--from, --from-dir <path-to-dir>', 'directory in where to lookup for dragees', '.')
    .option(
        '--to --to-dir <path-to-dir>',
        'directory in where to store reports',
        './dragee/reports'
    )
    .action(drawCommandhandler);

new Command()
    .addCommand(generateAsserter)
    .addCommand(generateGrapher)
    .addCommand(report)
    .addCommand(draw)
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse(process.argv);
