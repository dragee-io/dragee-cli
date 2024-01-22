import {AggregateAllowedDependencyRule} from "./rules/aggregates-allowed-dependencies.rule.ts";
import { AggregateMandatoryDependencyRule } from "./rules/aggregates-mandatory-dependencies.rule.ts";
import { FactoryAllowedDependencyRule } from "./rules/factories-allowed-dependencies.rule.ts";
import {RepositoryRule} from "./rules/repositories.rule.ts";
import { ServiceAllowedDependencyRule } from "./rules/services-allowed-dependencies.rule.ts";
import {ValueObjectRule} from "./rules/value-object.rule.ts"

const asserter: AssertHandler = (dragees: Dragee[]) => {
    const aggregateAllowedDependencyRuleResults = AggregateAllowedDependencyRule.apply(dragees)
    const aggregateMandatoryDependencyRuleResults = AggregateMandatoryDependencyRule.apply(dragees)
    const repositoryRuleResults = RepositoryRule.apply(dragees)
    const valueObjectRuleResults = ValueObjectRule.apply(dragees);
    const serviceRuleResults = ServiceAllowedDependencyRule.apply(dragees);
    const factoryRuleResults = FactoryAllowedDependencyRule.apply(dragees);

    let flattenResults = [
        aggregateAllowedDependencyRuleResults,
        repositoryRuleResults,
        valueObjectRuleResults,
        aggregateMandatoryDependencyRuleResults,
        serviceRuleResults,
        factoryRuleResults
    ].flatMap(result => result);

    console.log('flattenResults: ');
    console.log(flattenResults);

    const errors = flattenResults
        .filter(result => result.status === 'error')
        .map(result => {
            if (result.status === 'error') {
                return result.error.message
            }
        })
    return {
        pass: errors.length === 0,
        namespace: 'ddd',
        errors: errors,
    }
}

export const DddAsserter = { handler: asserter, namespace: 'ddd', filename: '' }