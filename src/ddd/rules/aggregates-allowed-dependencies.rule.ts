import {
    aggregates,
    directDependencies,
    type DrageeDependency,
    isEntity,
    isEvent,
    isValueObject
} from "../ddd-rules.utils.ts";
import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";

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
    return aggregates(dragees)
        .map(aggregate => directDependencies(aggregate, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const AggregateAllowedDependencyRule = {
    apply: rule
}