import type { Dragee } from "../../dragee.model.ts";
import {ko, ok, type Result} from "../../fp/result.model.ts";
import {
    directDependencies,
    type DrageeDependency,
    isEntity,
    isRepository,
    isValueObject,
    services
} from "../ddd-rules.utils.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => {
    return dependencies.map(dependency => {
        if (isRepository(dependency) || isEntity(dependency) || isValueObject(dependency)) {
            return ok<boolean>(true)
        } else {
            return ko<boolean>(new Error(`The service "${root.name}" must not have any dependency of type "${dependency.kind_of}"`))
        }
    })
}

const rule = (dragees: Dragee[]): Result<boolean>[] => {
    return services(dragees)
        .map(service => directDependencies(service, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDrageeDependency(dep))
        .flatMap(result => result)
}

export const ServiceAllowedDependencyRule = {
    apply: rule
}