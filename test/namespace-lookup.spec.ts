import { describe, expect, test } from 'bun:test';
import type { Dragee } from '@dragee-io/type/common';
import { lookupForNamespaces } from '../src/namespace-lookup.ts';

describe('Should retrive correct namespaces from dragees', () => {
    test('with no dragees', async () => {
        const dragees: Dragee[] = [];
        const namespaces = await lookupForNamespaces(dragees);

        expect(namespaces).toBeEmpty();
    });

    test('with dragees', async () => {
        const dragees: Dragee[] = [
            {
                name: 'dragee1',
                profile: 'template/test',
                depends_on: []
            },
            {
                name: 'dragee2',
                profile: 'ddd/test',
                depends_on: []
            },
            {
                name: 'dragee3',
                profile: 'ddd/aaa',
                depends_on: []
            }
        ];

        const namespaces = await lookupForNamespaces(dragees);
        expect(namespaces).toEqual(['template', 'ddd']);
    });
});
