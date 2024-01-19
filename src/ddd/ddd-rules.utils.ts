export const dependenciesOf: Dragee[] = (dragee: Dragee, allDragees: Dragee[]) => {
    if(!dragee.depends_on){
        return [];
    }
    
    return Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
        .filter(dragee => dragee !== undefined)
}


export const isAggregate: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/aggregate'

export const isValueObject: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/value_object'

export const isEntity: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/entity'

export const isEvent: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/event'

export const isRepository: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/repository'

export const isService: boolean = (dragee: Dragee) => dragee.kind_of === 'ddd/service'



