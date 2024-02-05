import type { Dragee, RuleResult } from "@dragee-io/asserter-type";
import {
    directDependencies,
    type DrageeDependency,
    kindOf,
    successful,
    failed
} from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";

const aggregateKind: Kind = "ddd/aggregate";

const isValueObject = (dragee: Dragee) => kindOf(dragee, "ddd/value_object")
const isEntity = (dragee: Dragee) => kindOf(dragee, "ddd/entity")
const isEvent = (dragee: Dragee) => kindOf(dragee, "ddd/event")

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {

        if (isValueObject(dependency) || isEntity(dependency) || isEvent(dependency)) {
            return successful()
        } else {
            return failed(`The aggregate "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
        }
    })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return kinds[aggregateKind].findIn(dragees)
        .map(aggregate => directDependencies(aggregate, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const AggregateAllowedDependencyRule = {
    apply: rule
}