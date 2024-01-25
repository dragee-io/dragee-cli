import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import {
    directDependencies,
    type DrageeDependency,
    kindOf,
} from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";

const serviceKind: Kind = "ddd/service"
const allowedDependencies: Kind[] = ["ddd/repository", "ddd/entity", "ddd/value_object", "ddd/command"]

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {
        const isDependencyAllowed = 
                allowedDependencies
                    .map(allowedDependency => kindOf(dependency, allowedDependency))
                    .reduce((a, b) => a || b)

        if (isDependencyAllowed) {
            return successful()
        } else {
            return failed(`The service "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
        }
    })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return kinds[serviceKind].findIn(dragees)
        .map(service => directDependencies(service, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const ServiceAllowedDependencyRule = {
    apply: rule
}