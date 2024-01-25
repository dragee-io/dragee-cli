import { kinds, type Kind} from "./ddd.model";
import type {Dragee} from "../dragee.model.ts";

export interface DrageeDependency {
    root: Dragee,
    dependencies: Dragee[]
}

export const directDependencies = (dragee: Dragee, allDragees: Dragee[]) => {
    if (!dragee.depends_on) {
        return {root: dragee, dependencies: []};
    }

    const dependencies = Object.keys(dragee.depends_on)
        .map(dependency => allDragees.find(dragee => dragee.name === dependency))
        .filter((dragee): dragee is Dragee => dragee !== undefined);

    return {root: dragee, dependencies: dependencies}
}

export const kindOf = (dragee: Dragee, kind: Kind): boolean => kinds[kind].is(dragee.kind_of);