import {AggregateRule} from "./rules/aggregates.rule.ts";
import {RepositoryRule} from "./rules/repositories.rule.ts";

const asserter: Asserter = (dragees: Dragee[]) => {
    const aggregateRuleResults = AggregateRule.apply(dragees)
    const repositoryRuleResults = RepositoryRule.apply(dragees)

    let flattenResults = [
        aggregateRuleResults,
        repositoryRuleResults
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