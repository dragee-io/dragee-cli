import type { Dragee } from '@dragee-io/type/common';
import type { Grapher } from '@dragee-io/type/grapher';
import { lookupForDragees } from '../dragee-lookup';
import { lookupForNamespaces } from '../namespace-lookup.ts';
import { lookupForProjects } from '../project-lookup.ts';

type Options = {
    fromDir: string;
    toDir: string;
};

export const drawCommandhandler = async ({ fromDir, toDir }: Options) => {
    const dragees = await lookupForDragees(fromDir);
    const namespaces = await lookupForNamespaces(dragees);
    const graphers: Grapher[] = await lookupForProjects(namespaces.map(n => `${n}-grapher`));
    graphers.forEach(grapher => grapherHandler(grapher, toDir, dragees));
};

const grapherHandler = async (grapher: Grapher, toDir: string, dragees: Dragee[]) => {
    grapher.graphs.forEach(async graph => {
        const graphFile = graph.handler(dragees);
        if (graphFile)
            await Bun.write(`${toDir}/${grapher.namespace}/${graph.label}.md`, graphFile);
    });
};
