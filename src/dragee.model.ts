enum DependencyType {
    CONSTRUCTOR = 'constructor',
    FIELD = 'field',
    METHOD_PARAM = 'method_param',
    METHOD_RETURN = 'method_return'
}

interface Dependency extends Record<string, DependencyType> {
}

export interface Dragee {
    name: string,
    kind_of: string,
    depends_on: Dependency[]
}

type Namespace = string;

type Report = {
    pass: boolean,
    namespace: Namespace,
    errors: string[],
};

type AssertHandler = (dragees: Dragee[]) => Report;

type Asserter = {
    namespace: Namespace,
    fileName: string,
    handler: AssertHandler
}; 
