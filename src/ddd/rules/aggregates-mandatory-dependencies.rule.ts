import {ko, ok} from "../../fp/result.model.ts";
import { dependenciesOf, isAggregate, isEntity } from "../ddd-rules.utils.ts";

const rule: RuleResult = (dragees: Dragee[]) => {
    const aggregates = dragees.filter(dragee => isAggregate(dragee))
    
    return aggregates.map(aggregate => {
        const hasEntity = dependenciesOf(aggregate, dragees)
        .map(dependencyDragee => isEntity(dependencyDragee))
        .some((isEntity: boolean)  => isEntity);
        
        if(hasEntity){
            return ok<boolean>(true);
        }else{
            return ko<boolean>(new Error(`The aggregate "${aggregate.name}" must at least contain a "ddd/entity" type dragee`))
        }
    })
        .flatMap(result => result)
}

export const AggregateMandatoryDependencyRule = {
    apply: rule
}