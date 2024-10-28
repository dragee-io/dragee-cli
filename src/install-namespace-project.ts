import { readFileSync, unlink } from 'node:fs';
import { Readable } from 'node:stream';
import { Parser, type ReadEntry } from 'tar';
import { config } from './cli.config.ts';
import { type Result, ok } from './fp/result.model.ts';
import {
    downloadProjectAndGetName,
    removeVersionAndExtension
} from './services/project.service.ts';

export const install = async <T>(projectName: string): Promise<Result<T>> => {
    // Download
    const projectFileName = await downloadProjectAndGetName(projectName, config.localRegistryPath);
    const destinationDirectoryName = `${config.localRegistryPath}/${removeVersionAndExtension(projectFileName)}`;

    // Extraction & file writing
    const files: ExtractedFile[] = await decompress(
        readFileSync(`${destinationDirectoryName}/${projectFileName}`)
    );
    for (const file of files) {
        const filePath = file.path.replace('package/', '');
        console.log('writing ', `${destinationDirectoryName}/${filePath}`);
        await Bun.write(`${destinationDirectoryName}/${filePath}`, file.content);
    }

    // Import
    const project = (await import(destinationDirectoryName)).default as T;

    // Delete targz
    unlink(`${destinationDirectoryName}/${projectFileName}`, err => {
        if (err) throw err;
        console.log(`${projectFileName} was deleted`);
    });

    return ok(project);
};

type ExtractedFile = {
    path: string;
    content: Buffer;
};

const decompress = (arrayBuffer: Buffer): Promise<ExtractedFile[]> =>
    new Promise((resolve, reject) => {
        const buffer = Buffer.from(arrayBuffer);
        const parseStream = new Parser();
        const files: ExtractedFile[] = [];

        parseStream
            .on('entry', (entry: ReadEntry) => {
                const chunks: Buffer[] = [];
                entry.on('data', (chunk: Buffer) => chunks.push(chunk));
                entry.on('end', () => {
                    const content = Buffer.concat(chunks);
                    files.push({ path: entry.path, content });
                });
            })
            .on('end', () => {
                resolve(files);
            })
            .on('error', (error: Error) => {
                reject(error);
            });

        const bufferStream = new Readable();
        bufferStream.pipe(parseStream);
        bufferStream.push(buffer);
        bufferStream.push(null);
    });
