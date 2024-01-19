import {AggregateAllowedDependencyRule} from "./rules/aggregates-allowed-dependencies.rule.ts";
import { AggregateMandatoryDependencyRule } from "./rules/aggregates-mandatory-dependencies.rule.ts";
import {RepositoryRule} from "./rules/repositories.rule.ts";
import {ValueObjectRule} from "./rules/value-object.rule.ts"

const asserter: Asserter = (dragees: Dragee[]) => {
    const aggregateAllowedDependencyRuleResults = AggregateAllowedDependencyRule.apply(dragees)
    const aggregateMandatoryDependencyRuleResults = AggregateMandatoryDependencyRule.apply(dragees)
    const repositoryRuleResults = RepositoryRule.apply(dragees)
    const valueObjectRuleResults = ValueObjectRule.apply(dragees);

    let flattenResults = [
        aggregateAllowedDependencyRuleResults,
        repositoryRuleResults,
        valueObjectRuleResults,
        aggregateMandatoryDependencyRuleResults
    ].flatMap(result => result);

    const errors = flattenResults
        .filter(result => result.status === 'error')
        .map(result => {
            if (result.status === 'error') {
                return result.error.message
            }
        })
    return {
        pass: errors.length === 0,
        errors: errors,
    }
}

export const DddAsserter = asserter