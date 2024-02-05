import type { Dragee } from "@dragee-io/asserter-type";

const kindsName =
  [
    'ddd/aggregate' 
    , 'ddd/entity' 
    , 'ddd/event' 
    , 'ddd/repository' 
    , 'ddd/service' 
    , 'ddd/value_object' 
    , 'ddd/factory' 
    , 'ddd/command'
  ]; 

export type Kind = typeof kindsName[number]

export type DDDKindChecks = {
  [kind in Kind]: {
   findIn: (dragees : Dragee[]) => Dragee[],
   is:(kind : string) => boolean
  }
}

export type DDDKindCheck<T extends Kind> = (value: string) => value is T;

export const kinds: DDDKindChecks = {} as DDDKindChecks;


kindsName.map(kind => {
  kinds[kind] = {
    is: (value: string) => value === kind,
    findIn: (dragees: Dragee[]) => dragees.filter(dragee => dragee.kind_of === kind)
  }
  return kinds[kind];
})


