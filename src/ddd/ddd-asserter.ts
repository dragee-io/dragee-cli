import {ko, ok, type Result} from "../fp/result.model.ts";

const dependenciesOf: Dragee[] = (dragee: Dragee, allDragees: Dragee[]) => {
    return Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
}

const isAggregate: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/aggregate'
const isValueObject: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/value_object'

const asserter: Asserter = (dragees: Dragee[]) => {
    const aggregates = dragees.filter(dragee => isAggregate(dragee))

    const ruleResults: Result<boolean>[] = aggregates.map(aggregate => {
        return dependenciesOf(aggregate, dragees)
            .filter(dragee => dragee !== undefined)
            .map(dependencyDragee => {
                if (isValueObject(dependencyDragee)) {
                    return ok<boolean>(true)
                } else {
                    return ko<boolean>(new Error(`The aggregate "${aggregate.name}" must not have any dependency of type "${dependencyDragee.kind_of}"`))
                }
            })
    })
        .flatMap(result => result)

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