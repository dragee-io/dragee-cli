import type { Dragee, RuleResult } from "@dragee-io/asserter-type";
import {
    directDependencies,
    type DrageeDependency,
    kindOf,
    successful,
    failed,
} from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";

const serviceKind: Kind = "ddd/service"
const isRepository = (dragee: Dragee) => kindOf(dragee, "ddd/repository")
const isEntity = (dragee: Dragee) => kindOf(dragee, "ddd/entity")
const isValueObject = (dragee: Dragee) => kindOf(dragee, "ddd/value_object")
const isCommand = (dragee: Dragee) => kindOf(dragee, "ddd/command")

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
    return kinds[serviceKind].findIn(dragees)
        .map(service => directDependencies(service, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const ServiceAllowedDependencyRule = {
    apply: rule
}