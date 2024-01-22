import {ko, ok} from "../../fp/result.model.ts";
import { dependenciesOf, isEntity, isValueObject, isFactory, isAggregate } from "../ddd-rules.utils.ts";

const rule: RuleResult = (dragees: Dragee[]) => {
    const factories = dragees.filter(dragee => isFactory(dragee))
    
    return factories.map(factory => {
        return dependenciesOf(factory, dragees)
            .map(dependencyDragee => {
                const isValid =    isAggregate(dependencyDragee) 
                                || isEntity(dependencyDragee) 
                                || isValueObject(dependencyDragee);
                if (isValid) {
                    return ok<boolean>(true)
                } else {
                    return ko<boolean>(new Error(`The factory "${factory.name}" must not have any dependency of type "${dependencyDragee.kind_of}"`))
                }
            })
    })
        .flatMap(result => result)
}

export const FactoryAllowedDependencyRule = {
    apply: rule
}