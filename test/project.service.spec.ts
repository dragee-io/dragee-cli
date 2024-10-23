import { describe, expect, test } from 'bun:test';
import { removeVersionAndExtension } from '../src/services/project.service.ts';

describe('Should remove version and extension from project name', () => {
    test('with empty string', async () => {
        const projectName = '';
        const result = removeVersionAndExtension(projectName);
        expect(result).toBeEmpty();
    });

    test('with project name', async () => {
        const projectName = 'ddd-asserter-0.0.2-latest.tgz';
        const result = removeVersionAndExtension(projectName);
        expect(result).toBe('ddd-asserter-0.0.2');
    });
});
