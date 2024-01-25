import {
    directDependencies,
    type DrageeDependency,
    kindOf
} from "../ddd-rules.utils.ts";
import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import { kinds, type Kind } from "../ddd.model.ts";

const aggregateKind: Kind = "ddd/aggregate";
const allowedDependencies: Kind[] = ["ddd/value_object", "ddd/entity", "ddd/event"];

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {
        const isDependencyAllowed = 
                allowedDependencies
                    .map(allowedDependency => kindOf(dependency, allowedDependency))
                    .reduce((a, b) => a || b)

        if (isDependencyAllowed) {
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