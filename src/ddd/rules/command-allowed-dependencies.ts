
import type { Dragee, RuleResult } from "@dragee-io/asserter-type";
import {type DrageeDependency, directDependencies, kindOf, successful, failed } from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";
const commandKind: Kind = "ddd/command"
const isAggregate = (dragee: Dragee) => kindOf(dragee, "ddd/aggregate")

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
    return kinds[commandKind].findIn(dragees)
        .map(command => directDependencies(command, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const CommandAllowedDependencyRule = {
    apply: rule
}