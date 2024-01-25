import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import {
    directDependencies,
    type DrageeDependency,
    factories,
    isAggregate,
    isEntity,
    isValueObject
} from "../ddd-rules.utils.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {
        if (isAggregate(dependency) || isEntity(dependency) || isValueObject(dependency)) {
            return successful()
        } else {
            return failed(`The factory "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
        }
    })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return factories(dragees)
        .map(factory => directDependencies(factory, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const FactoryAllowedDependencyRule = {
    apply: rule
}