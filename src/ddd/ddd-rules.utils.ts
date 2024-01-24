import type {DDDKind} from "./ddd.model";
import type {Dragee} from "../dragee.model.ts";

export interface DrageeDependency {
    root: Dragee,
    dependencies: Dragee[]
}

export const directDependencies = (dragee: Dragee, allDragees: Dragee[]) => {
    if (!dragee.depends_on) {
        return {root: dragee, dependencies: []};
    }

    const dependencies = Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
        .filter((dragee): dragee is Dragee => dragee !== undefined);

    return {root: dragee, dependencies: dependencies}
}

const kindOf = (dragee: Dragee, kind: DDDKind): boolean => dragee.kind_of === kind

export const isAggregate = (dragee: Dragee): boolean => kindOf(dragee, 'ddd/aggregate')
export const isEntity = (dragee: Dragee): boolean => kindOf(dragee, 'ddd/entity')
export const isEvent = (dragee: Dragee): boolean => kindOf(dragee, 'ddd/event')
export const isRepository = (dragee: Dragee): boolean => kindOf(dragee, 'ddd/repository')
export const isService = (dragee: Dragee): boolean => kindOf(dragee, 'ddd/service')
export const isValueObject = (dragee: Dragee): boolean => kindOf(dragee, 'ddd/value_object')
export const isFactory = (dragee: Dragee): boolean => kindOf(dragee, 'ddd/factory')

export const aggregates = (dragees: Dragee[]) => dragees.filter(dragee => isAggregate(dragee))
export const entities = (dragees: Dragee[]) => dragees.filter(dragee => isEntity(dragee))
export const factories = (dragees: Dragee[]) => dragees.filter(dragee => isFactory(dragee))
export const services = (dragees: Dragee[]) => dragees.filter(dragee => isService(dragee))
export const valueObjects = (dragees: Dragee[]) => dragees.filter(dragee => isValueObject(dragee))

