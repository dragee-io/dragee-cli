import {Command} from 'commander';
import {handler} from "./command.handler.ts";

export const program = new Command();

program
    .argument('run', 'detect dragees and build reports')
    .option('--from, --from-dir <path-to-dir>', 'directory in where to lookup for dragees', '.')
    .option('--to --to-dir <path-to-dir>', 'directory in where to store reports', './dragee/reports')
    .action(handler)

program
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse(process.argv);