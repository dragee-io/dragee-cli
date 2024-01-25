import type {Dragee, FailedRuleResult, Report, Rule} from "../dragee.model.ts";
import {AggregateAllowedDependencyRule} from "./rules/aggregates-allowed-dependencies.rule.ts";
import {AggregateMandatoryDependencyRule} from "./rules/aggregates-mandatory-dependencies.rule.ts";
import {CommandAllowedDependencyRule} from "./rules/command-allowed-dependencies.ts";
import {FactoryAllowedDependencyRule} from "./rules/factories-allowed-dependencies.rule.ts";
import {RepositoryRule} from "./rules/repositories.rule.ts";
import {ServiceAllowedDependencyRule} from "./rules/services-allowed-dependencies.rule.ts";
import {ValueObjectRule} from "./rules/value-object.rule.ts"

const asserter = (dragees: Dragee[]): Report => {

    const rules: Rule[] =
        [
            AggregateAllowedDependencyRule,
            AggregateMandatoryDependencyRule,
            RepositoryRule,
            ValueObjectRule,
            ServiceAllowedDependencyRule,
            FactoryAllowedDependencyRule,
            CommandAllowedDependencyRule
        ]

    const rulesResultsErrors = rules
        .flatMap(rule => rule.apply(dragees))
        .filter((result): result is FailedRuleResult => !result.pass)
        .map(result => result.message);

    return {
        pass: rulesResultsErrors.length === 0,
        namespace: 'ddd',
        errors: rulesResultsErrors,
    }
}

export const DddAsserter = {handler: asserter, namespace: 'ddd', filename: ''}
export default DddAsserter;