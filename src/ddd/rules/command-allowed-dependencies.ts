import { failed, type Dragee, successful, type RuleResult } from "../../dragee.model.ts";
import {ko, ok, type Result} from "../../fp/result.model.ts";
import {type DrageeDependency, directDependencies, kindOf } from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";
const commandKind: Kind = "ddd/command"
const allowedDependencies = ['ddd/aggregate'];

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {
        const isDependencyAllowed = 
                allowedDependencies
                    .map(allowedDependency => kindOf(dependency, allowedDependency))
                    .reduce((a, b) => a || b)

        if (isDependencyAllowed) {
            return successful()
        } else {
            return failed(`The command "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
        }
    })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return kinds[commandKind].findIn(dragees)
        .map(command => directDependencies(command, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const CommandAllowedDependencyRule = {
    apply: rule
}