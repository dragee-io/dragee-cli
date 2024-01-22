import {ko, ok} from "../../fp/result.model.ts";
import { dependenciesOf, isService, isEntity, isValueObject, isRepository } from "../ddd-rules.utils.ts";

const rule: RuleResult = (dragees: Dragee[]) => {
    const services = dragees.filter(dragee => isService(dragee))

    return services.map(service => {
        return dependenciesOf(service, dragees)
            .map(dependencyDragee => {
                const isValid =    isRepository(dependencyDragee) 
                                || isEntity(dependencyDragee) 
                                || isValueObject(dependencyDragee);
                if (isValid) {
                    return ok<boolean>(true)
                } else {
                    return ko<boolean>(new Error(`The service "${service.name}" must not have any dependency of type "${dependencyDragee.kind_of}"`))
                }
            })
    })
        .flatMap(result => result)
}

export const ServiceAllowedDependencyRule = {
    apply: rule
}