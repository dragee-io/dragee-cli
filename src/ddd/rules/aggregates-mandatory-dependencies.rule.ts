import {directDependencies, type DrageeDependency} from "../ddd-rules.utils.ts";
import {type Dragee, failed, type RuleResult, successful} from "../../dragee.model.ts";
import { kinds, type Kind } from "../ddd.model.ts";


const entityKind: Kind = "ddd/entity";
const aggregateKind: Kind = "ddd/aggregate";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult => {
    if (kinds[entityKind].findIn(dependencies).length) {
        return successful()
    } else {
        return failed(`The aggregate "${root.name}" must at least contain a "ddd/entity" type dragee`)
    }
}

const rule = (dragees: Dragee[]): RuleResult[] => {
    return kinds[aggregateKind].findIn(dragees)
        .map(aggregate => directDependencies(aggregate, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const AggregateMandatoryDependencyRule = {
    apply: rule
}