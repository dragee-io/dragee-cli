import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import axios from 'axios';
import { config } from './../cli.config.ts';

export const downloadProjectAndGetName = async (projectName: string, projectsDirectory: string) => {
    const projectArchiveUrl = `${config.projectsRegistryUrl}/${projectName}/latest`;

    try {
        const downloadData = (
            await axios.get(projectArchiveUrl, {
                headers: {
                    Accept: 'application/json'
                }
            })
        ).data.dist;

        const tarball = downloadData.tarball;
        const fileName = tarball.split('/').pop();
        const filePath = `${projectsDirectory}/${removeVersionAndExtension(fileName)}/${fileName}`;

        controlPackageIntegrity(downloadData.integrity as string, filePath, projectName);

        const { data } = await axios.get(tarball, {
            responseType: 'arraybuffer'
        });

        await Bun.write(filePath, data);
        console.log(`Project ${projectName} has been downloaded`);

        return fileName;
    } catch (err) {
        throw Error(`Could not download ${projectName} at url ${projectArchiveUrl}: ${err}`);
    }
};

export const removeVersionAndExtension = (projectName: string) => {
    const extensionSeparator = '.';
    const versionSeparator = '-';

    return projectName
        .split(extensionSeparator)
        .slice(0, -1)
        .join(extensionSeparator)
        .split(versionSeparator)
        .slice(0, -1)
        .join(versionSeparator);
};

export const generateChecksumFile = (fileName: string, algorithm: string): string => {
    const fileData = readFileSync(fileName);
    return createHash(algorithm).update(fileData).digest('base64');
};

export const controlPackageIntegrity = (
    downloadDataIntegrity: string,
    filePath: string,
    projectName: string
) => {
    const [algorithm, integrity] = downloadDataIntegrity.split('-');
    const generatedChecksum = generateChecksumFile(filePath, algorithm);
    if (generatedChecksum !== integrity)
        throw Error(`Could not verify ${projectName} package integrity`);
};
