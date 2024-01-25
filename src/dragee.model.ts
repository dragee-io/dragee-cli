export enum DependencyType {
    CONSTRUCTOR = 'constructor',
    FIELD = 'field',
    METHOD_PARAM = 'method_param',
    METHOD_RETURN = 'method_return'
}

export interface Dependency extends Record<string, DependencyType> {
}

export interface Dragee {
    name: string,
    kind_of: string,
    depends_on: Dependency[]
}

export type Namespace = string;

export type Report = {
    pass: boolean,
    namespace: Namespace,
    errors: string[],
};

export type SuccessfulRuleResult = {
    pass: true
}

export type FailedRuleResult = {
    pass: false,
    message: string,
}

export type RuleResult = SuccessfulRuleResult | FailedRuleResult

export const successful = (): SuccessfulRuleResult => ({pass: true})
export const failed = (message: string): FailedRuleResult => ({pass: false, message: message})

export type Rule = {
    apply: (dragees: Dragee[]) => RuleResult[]
}

export type RuleError = {
    namespace: Namespace,
    error: string
}

export type AssertHandler = (dragees: Dragee[]) => Report;

export type Asserter = {
    namespace: Namespace,
    fileName: string,
    handler: AssertHandler
}; 
