import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import {commands, directDependencies, type DrageeDependency, isAggregate} from "../ddd-rules.utils.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {
        if (isAggregate(dependency)) {
            return successful()
        } else {
            return failed(`The command "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
        }
    })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return commands(dragees)
        .map(command => directDependencies(command, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const CommandAllowedDependencyRule = {
    apply: rule
}