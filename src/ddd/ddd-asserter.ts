import {AggregateRule} from "./rules/aggregates.rule.ts";

const asserter: Asserter = (dragees: Dragee[]) => {
    const ruleResults: RuleResult = AggregateRule.apply(dragees)

    const errors = ruleResults
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