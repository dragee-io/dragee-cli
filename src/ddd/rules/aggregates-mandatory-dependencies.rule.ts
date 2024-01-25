import {aggregates, directDependencies, type DrageeDependency, entities} from "../ddd-rules.utils.ts";
import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult => {
    if (entities(dependencies).length) {
        return successful()
    } else {
        return failed(`The aggregate "${root.name}" must at least contain a "ddd/entity" type dragee`)
    }
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return aggregates(dragees)
        .map(aggregate => directDependencies(aggregate, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const AggregateMandatoryDependencyRule = {
    apply: rule
}