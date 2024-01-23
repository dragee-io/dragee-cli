import type { AssertHandler, Dragee, Report } from "../dragee.model.ts";
import type { Ko } from "../fp/result.model.ts";
import {AggregateAllowedDependencyRule} from "./rules/aggregates-allowed-dependencies.rule.ts";
import { AggregateMandatoryDependencyRule } from "./rules/aggregates-mandatory-dependencies.rule.ts";
import { FactoryAllowedDependencyRule } from "./rules/factories-allowed-dependencies.rule.ts";
import {RepositoryRule} from "./rules/repositories.rule.ts";
import { ServiceAllowedDependencyRule } from "./rules/services-allowed-dependencies.rule.ts";
import {ValueObjectRule} from "./rules/value-object.rule.ts"

const asserter = (dragees: Dragee[]): AssertHandler => {
    
    const rules = 
    [
        AggregateAllowedDependencyRule,
        AggregateMandatoryDependencyRule,
        RepositoryRule,
        ValueObjectRule, 
        ServiceAllowedDependencyRule, 
        FactoryAllowedDependencyRule
    ]

    const rulesResultsErrors = rules
        .flatMap(rule => rule.apply(dragees))
        .filter((result): result is Ko => result.status === 'error')
        .map(result => result.error.message);
    
    return {
        pass: rulesResultsErrors.length === 0,
        namespace: 'ddd',
        errors: rulesResultsErrors,
    }
}

export const DddAsserter = { handler: asserter, namespace: 'ddd', filename: '' }