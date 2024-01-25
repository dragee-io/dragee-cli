import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import {
    directDependencies,
    type DrageeDependency,
    kindOf,
} from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";

const factoryKind : Kind = "ddd/factory";
const allowedDependencies: Kind[] = ["ddd/aggregate", "ddd/entity", "ddd/value_object"]

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => {
    return dependencies
        .map(dependency => {

            const isDependencyAllowed = 
                allowedDependencies
                    .map(allowedDependency => kindOf(dependency, allowedDependency))
                    .reduce((a, b) => a || b)

            if (isDependencyAllowed){
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