import {ko, ok} from "../../fp/result.model.ts";
import {isEntity, isValueObject, valueObjects} from "../ddd-rules.utils.ts";
import type {Dragee} from "../../dragee.model.ts";


const executionSucceeded = () => (ok<boolean>(true))
const executionFailed = (valueObject: Dragee, dependencyDragee: Dragee) => (ko<boolean>(new Error(`The value object "${valueObject.name}" must not have any dependency of type "${dependencyDragee.kind_of}"`)))

interface DrageeDependency {
    root: Dragee,
    dependencies: Dragee[]
}

const directDependencies: DrageeDependency = (dragee: Dragee, allDragees: Dragee[]) => {
    if (!dragee.depends_on) {
        return {root: dragee, dependencies: []};
    }

    const dependencies = Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
        .filter(dragee => dragee !== undefined);

    return {root: dragee, dependencies: dependencies}
}

const assertDep = ({root, dependencies}: DrageeDependency) => {
    return dependencies.map(dependency => {
        if (isEntity(dependency) || isValueObject(dependency)) {
            return executionSucceeded()
        } else {
            return executionFailed(root, dependency)
        }
    })
}

const rule: RuleResult = (dragees: Dragee[]) => {
    return valueObjects(dragees)
        .map(valueObject => directDependencies(valueObject, dragees))
        .filter(dep => dep.dependencies)
        .map(dep => assertDep(dep))
        .flatMap(result => result)
}

export const ValueObjectRule = {
    apply: rule
}