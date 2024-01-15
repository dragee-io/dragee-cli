import {ko, ok} from "../../fp/result.model.ts";

const dependenciesOf: Dragee[] = (dragee: Dragee, allDragees: Dragee[]) => {
    return Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
        .filter(dragee => dragee !== undefined)
}

const isAggregate: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/aggregate'
const isValueObject: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/value_object'
const isEntity: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/entity'

const rule: RuleResult = (dragees: Dragee[]) => {
    const aggregates = dragees.filter(dragee => isAggregate(dragee))

    return aggregates.map(aggregate => {
        return dependenciesOf(aggregate, dragees)
            .map(dependencyDragee => {
                if (isValueObject(dependencyDragee) || isEntity(dependencyDragee)) {
                    return ok<boolean>(true)
                } else {
                    return ko<boolean>(new Error(`The aggregate "${aggregate.name}" must not have any dependency of type "${dependencyDragee.kind_of}"`))
                }
            })
    })
        .flatMap(result => result)
}

export const AggregateRule = {
    apply: rule
}