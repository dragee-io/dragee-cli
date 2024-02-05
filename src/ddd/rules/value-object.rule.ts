import type { Dragee, Rule, RuleResult } from "@dragee-io/asserter-type";
import {directDependencies, type DrageeDependency, kindOf, successful, failed} from "../ddd-rules.utils.ts";
import { kinds, type Kind } from "../ddd.model.ts";

const valueObjectKind: Kind = "ddd/value_object";
const isValueObject = (dragee: Dragee) => kindOf(dragee, "ddd/value_object")


const newAssertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => {
    return dependencies.map(dependency => {
        if (isValueObject(dependency)) {
            return successful()
        } else {
            return failed(`The value object "${root.name}" must not have any dependency of type "${dependency.kind_of}"`)
        }
    })
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return kinds[valueObjectKind].findIn(dragees)
        .map(valueObject => directDependencies(valueObject, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => newAssertDrageeDependency(dep))
        .flatMap(result => result)
}

export const ValueObjectRule: Rule = {
    apply: rule,
}