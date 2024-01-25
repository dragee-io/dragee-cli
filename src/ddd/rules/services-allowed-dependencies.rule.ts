import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import {
    directDependencies,
    type DrageeDependency,
    isCommand,
    isEntity,
    isRepository,
    isValueObject,
    services
} from "../ddd-rules.utils.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {
        if (isRepository(dependency) || isEntity(dependency) || isValueObject(dependency) || isCommand(dependency)) {
            return successful()
        } else {
            return failed(`The service "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
        }
    })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return services(dragees)
        .map(service => directDependencies(service, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const ServiceAllowedDependencyRule = {
    apply: rule
}