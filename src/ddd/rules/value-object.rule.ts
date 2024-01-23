import {ko, ok} from "../../fp/result.model.ts";
import {directDependencies, type DrageeDependency, isEntity, isValueObject, valueObjects} from "../ddd-rules.utils.ts";
import type {Dragee} from "../../dragee.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => {
    return dependencies.map(dependency => {
        if (isEntity(dependency) || isValueObject(dependency)) {
            return ok<boolean>(true)
        } else {
            return ko<boolean>(new Error(`The value object "${root.name}" must not have any dependency of type "${dependency.kind_of}"`))
        }
    })
}

const rule: RuleResult = (dragees: Dragee[]) => {
    return valueObjects(dragees)
        .map(valueObject => directDependencies(valueObject, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const ValueObjectRule = {
    apply: rule
}