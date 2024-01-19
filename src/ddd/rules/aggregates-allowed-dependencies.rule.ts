import {ko, ok} from "../../fp/result.model.ts";
import { dependenciesOf, isAggregate, isValueObject, isEntity, isEvent } from "../ddd-rules.utils.ts";

const rule: RuleResult = (dragees: Dragee[]) => {
    const aggregates = dragees.filter(dragee => isAggregate(dragee))

    return aggregates.map(aggregate => {
        return dependenciesOf(aggregate, dragees)
            .map(dependencyDragee => {
                const isValid =    isValueObject(dependencyDragee) 
                                || isEntity(dependencyDragee) 
                                || isEvent(dependencyDragee);
                if (isValid) {
                    return ok<boolean>(true)
                } else {
                    return ko<boolean>(new Error(`The aggregate "${aggregate.name}" must not have any dependency of type "${dependencyDragee.kind_of}"`))
                }
            })
    })
        .flatMap(result => result)
}

export const AggregateAllowedDependencyRule = {
    apply: rule
}