import type {DDDKind} from "./ddd.model";
import type {Dragee} from "../dragee.model.ts";

export interface DrageeDependency {
    root: Dragee,
    dependencies: Dragee[]
}

export const directDependencies: DrageeDependency = (dragee: Dragee, allDragees: Dragee[]) => {
    if (!dragee.depends_on) {
        return {root: dragee, dependencies: []};
    }

    const dependencies = Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
        .filter(dragee => dragee !== undefined);

    return {root: dragee, dependencies: dependencies}
}

const kindOf: boolean = (dragee: Dragee, kind: DDDKind) => dragee.kind_of === kind

export const isAggregate: boolean = (dragee: Dragee) => kindOf(dragee, 'ddd/aggregate')
export const isEntity: boolean = (dragee: Dragee) => kindOf(dragee, 'ddd/entity')
export const isEvent: boolean = (dragee: Dragee) => kindOf(dragee, 'ddd/event')
export const isRepository: boolean = (dragee: Dragee) => kindOf(dragee, 'ddd/repository')
export const isService: boolean = (dragee: Dragee) => kindOf(dragee, 'ddd/service')
export const isValueObject: boolean = (dragee: Dragee) => kindOf(dragee, 'ddd/value_object')
export const isFactory: boolean = (dragee: Dragee) => kindOf(dragee, 'ddd/factory')

export const aggregates = (dragees: Dragee[]) => dragees.filter(dragee => isAggregate(dragee))
export const entities = (dragees: Dragee[]) => dragees.filter(dragee => isEntity(dragee))
export const factories = (dragees: Dragee[]) => dragees.filter(dragee => isFactory(dragee))
export const services = (dragees: Dragee[]) => dragees.filter(dragee => isService(dragee))
export const valueObjects = (dragees: Dragee[]) => dragees.filter(dragee => isValueObject(dragee))

