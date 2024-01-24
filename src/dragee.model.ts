export enum DependencyType {
    CONSTRUCTOR = 'constructor',
    FIELD = 'field',
    METHOD_PARAM = 'method_param',
    METHOD_RETURN = 'method_return'
}

export interface Dependency extends Record<string, DependencyType>{}

export type Dragee = {
    name: string,
    kind_of: string,
    depends_on: Dependency[]
}

export type Namespace = string;

export type Report = string;

export type AssertHandler = (dragees: Dragee[]) => Report;

export type Asserter = {
    namespace: Namespace,
    fileName: string,
    handler: AssertHandler
};