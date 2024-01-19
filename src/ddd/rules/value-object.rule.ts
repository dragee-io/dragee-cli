import {ko, ok} from "../../fp/result.model.ts";
import { dependenciesOf, isValueObject, isEntity } from "../ddd-rules.utils.ts";

const rule: RuleResult = (dragees: Dragee[]) => {
    const valueObjects = dragees.filter(dragee => isValueObject(dragee))
    
    return valueObjects.map(valueObject => {
        return dependenciesOf(valueObject, dragees)
            .map(dependencyDragee => {
                if (isEntity(dependencyDragee) || isValueObject(dependencyDragee)) {
                    return ok<boolean>(true)
                } else {
                    return ko<boolean>(new Error(`The value object "${valueObject.name}" must not have any dependency of type "${dependencyDragee.kind_of}"`))
                }
            })
    })
        .flatMap(result => result)
}

export const ValueObjectRule = {
    apply: rule
}