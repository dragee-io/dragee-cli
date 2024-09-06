import type { Dragee, Namespace } from "@dragee-io/asserter-type";

export const lookupForNamespaces = async (dragees: Dragee[]): Promise<Namespace[]> => {
    console.log('Looking up for namespaces');

    const nonUniqueNamespaces = dragees.map(dragee => {
        const [namespace] = dragee.profile.split('/');
        return namespace;
    });

    return [...new Set(nonUniqueNamespaces)];
};