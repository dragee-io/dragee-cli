import {ko, ok, type Result} from "../../fp/result.model.ts";
import {aggregates, directDependencies, type DrageeDependency, entities} from "../ddd-rules.utils.ts";
import type {Dragee} from "../../dragee.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => {
    if (entities(dependencies).length) {
        return ok<boolean>(true)
    } else {
        return ko<boolean>(new Error(`The aggregate "${root.name}" must at least contain a "ddd/entity" type dragee`))
    }
}

const rule = (dragees: Dragee[]): Result<boolean>[] => {
    return aggregates(dragees)
        .map(aggregate => directDependencies(aggregate, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const AggregateMandatoryDependencyRule = {
    apply: rule
}