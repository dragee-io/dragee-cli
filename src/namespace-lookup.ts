import type {Dragee, Namespace} from "./dragee.model.ts";

export const lookupForNamespaces = async (dragees: Dragee[]): Promise<Namespace[]> => {
    console.log('Looking up for namespaces');

    const nonUniqueNamespaces = dragees.map(dragee => {
        const [namespace, ...rest] = dragee.kind_of.split('/');
        return namespace;
    });

    return [...new Set(nonUniqueNamespaces)];
};