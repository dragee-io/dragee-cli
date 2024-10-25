import { describe, expect, test } from 'bun:test';
import {
    controlPackageIntegrity,
    generateChecksumFile,
    removeVersionAndExtension
} from '../src/services/project.service.ts';

describe('Should remove version and extension from project name', () => {
    test('with empty string', async () => {
        const projectName = '';
        const result = removeVersionAndExtension(projectName);
        expect(result).toBeEmpty();
    });

    test('with project name', async () => {
        const projectName = 'ddd-asserter-0.0.2-latest.tgz';
        const result = removeVersionAndExtension(projectName);
        expect(result).toBe('ddd-asserter');
    });
});

describe('Should generate checksum file', () => {
    test('with test file and sha512', async () => {
        const fileName = './test/approval/test-file-checksum.txt';
        const algorithm = 'sha512';
        const result = generateChecksumFile(fileName, algorithm);
        expect(result).toBe(
            'sVAC2mwmIInQiUpg6RA9w/WijIpmL2ZttHG5bsOxB09c/iDdC/S2M0QvSLAa+fsxTJqnTTgcrJnFRoDv+PEbow=='
        );
    });

    test('with test file and sha1', async () => {
        const fileName = './test/approval/test-file-checksum.txt';
        const algorithm = 'sha1';
        const result = generateChecksumFile(fileName, algorithm);
        expect(result).toBe('Tomopt5LF4aOs2jXjv0HOAll9+c=');
    });
});

describe('Should control file integrity', () => {
    test('with correct file', async () => {
        const fileName = './test/approval/test-file-checksum.txt';
        const downloadDataIntegrity =
            'sha512-sVAC2mwmIInQiUpg6RA9w/WijIpmL2ZttHG5bsOxB09c/iDdC/S2M0QvSLAa+fsxTJqnTTgcrJnFRoDv+PEbow==';
        const projectName = 'test-project';
        expect(() =>
            controlPackageIntegrity(downloadDataIntegrity, fileName, projectName)
        ).not.toThrowError();
    });

    test('with incorrect file', async () => {
        const fileName = './test/approval/test-file-checksum.txt';
        const downloadDataIntegrity = 'sha512-AZERTYUIOP';
        const projectName = 'test-project';
        expect(() =>
            controlPackageIntegrity(downloadDataIntegrity, fileName, projectName)
        ).toThrowError('Could not verify test-project package integrity');
    });
});
