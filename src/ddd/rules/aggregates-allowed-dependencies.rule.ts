import {ko, ok, type Result} from "../../fp/result.model.ts";
import {
    aggregates,
    directDependencies,
    type DrageeDependency,
    isEntity,
    isEvent,
    isValueObject
} from "../ddd-rules.utils.ts";
import type {Dragee} from "../../dragee.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => {
    return dependencies.map(dependency => {
        if (isValueObject(dependency) || isEntity(dependency) || isEvent(dependency)) {
            return ok<boolean>(true)
        } else {
            return ko<boolean>(new Error(`The aggregate "${root.name}" must not have any dependency of type "${dependency.kind_of}"`))
        }
    })
}

const rule = (dragees: Dragee[]): Result<boolean>[] => {
    return aggregates(dragees)
        .map(aggregate => directDependencies(aggregate, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const AggregateAllowedDependencyRule = {
    apply: rule
}