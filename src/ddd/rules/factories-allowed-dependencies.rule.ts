
import type { Dragee, RuleResult } from "@dragee-io/asserter-type";
import {
    directDependencies,
    type DrageeDependency,
    kindOf,
    successful,
    failed,
} from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";

const factoryKind : Kind = "ddd/factory";

const isAggregate = (dragee: Dragee) => kindOf(dragee, "ddd/aggregate")
const isEntity = (dragee: Dragee) => kindOf(dragee, "ddd/entity")
const isValueObject = (dragee: Dragee) => kindOf(dragee, "ddd/value_object")

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => {
    return dependencies
        .map(dependency => {
            if (isAggregate(dependency) || isEntity(dependency) || isValueObject(dependency)){
                return successful()
            } else {
                return failed(`The factory "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
            }
        })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return kinds[factoryKind].findIn(dragees)
        .map(factory => directDependencies(factory, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const FactoryAllowedDependencyRule = {
    apply: rule
}