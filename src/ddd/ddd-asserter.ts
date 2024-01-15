const dependenciesOf: Dragee[] = (dragee: Dragee, allDragees: Dragee[]) => {
    return Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
}

const isAggregate: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/aggregate'
const isValueObject: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/value_object'

const asserter: Asserter = (dragees: Dragee[]) => {
    const aggregates = dragees.filter(dragee => isAggregate(dragee))

    const pass = aggregates.map(aggregate => {
        return dependenciesOf(aggregate, dragees).map(dependencyDragee => isValueObject(dependencyDragee))
    })
        .flatMap(result => result)
        .filter(result => !result)

    return {
        pass: pass.length === 0
    }
}

export const DddAsserter = asserter