import type { Dragee } from "../../dragee.model.ts";
import {ko, ok, type Result} from "../../fp/result.model.ts";
import { isAggregate, type DrageeDependency, commands, directDependencies } from "../ddd-rules.utils.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => {
    return dependencies.map(dependency => {
        if (isAggregate(dependency)) {
            return ok<boolean>(true)
        } else {
            return ko<boolean>(new Error(`The command "${root.name}" must not have any dependency of type "${dependency.kind_of}"`))
        }
    })
}

const rule = (dragees: Dragee[]): Result<boolean>[] => {
    return commands(dragees)
        .map(command => directDependencies(command, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const CommandAllowedDependencyRule = {
    apply: rule
}