import {type Dragee, failed, type Rule, type RuleResult, successful} from "../../dragee.model.ts";
import {directDependencies, type DrageeDependency, isValueObject, valueObjects} from "../ddd-rules.utils.ts";

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
    return valueObjects(dragees)
        .map(valueObject => directDependencies(valueObject, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => newAssertDrageeDependency(dep))
        .flatMap(result => result)
}

export const ValueObjectRule: Rule = {
    apply: rule,
}