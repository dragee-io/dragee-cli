import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, rmdirSync } from 'node:fs';
import { emptyDir } from '../src/commands/clear-registry-command.handler.ts';

const testDir = 'test/approval';

beforeAll(() => {
    // Create case test
    mkdirSync(`${testDir}/testClearRegistry`);
    mkdirSync(`${testDir}/testClearRegistry/aaa`);
    Bun.write(`${testDir}/testClearRegistry/aaa/aaa.txt`, 'aaa');
});

afterAll(() => {
    // Delete case test
    rmdirSync(`${testDir}/testClearRegistry`, { recursive: true });
});

describe('Should empty directory', () => {
    test('with directory not found', async () => {
        expect(() => emptyDir(`${testDir}/testClearRegistryToto`)).toThrowError(
            'No such file or directory'
        );
        expect(await Bun.file(`${testDir}/testClearRegistry/aaa/aaa.txt`).exists()).toBeTrue();
    });

    test('with found directory', async () => {
        expect(() => emptyDir(`${testDir}/testClearRegistry`)).not.toThrowError();
        expect(await Bun.file(`${testDir}/testClearRegistry/aaa/aaa.txt`).exists()).toBeFalse();
    });
});
