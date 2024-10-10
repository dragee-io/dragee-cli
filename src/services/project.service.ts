import axios from 'axios';
import { config } from './../cli.config.ts';

export const downloadProjectAndGetName = async (projectName: string, projectsDirectory: string) => {
    const projectArchiveUrl = `${config.projectsRegistryUrl}/${projectName}/latest`;

    try {
        const tarball = (
            await axios.get(projectArchiveUrl, {
                headers: {
                    Accept: 'application/json'
                }
            })
        ).data.dist.tarball;

        const fileName = tarball.split('/').pop();
        const directoryName = removeVersionAndExtension(fileName);
        const { data } = await axios.get(tarball, {
            responseType: 'arraybuffer'
        });

        await Bun.write(`${projectsDirectory}/${directoryName}/${fileName}`, data);
        console.log(`Project ${projectName} has been downloaded`);

        return fileName;
    } catch (err) {
        throw Error(`Could not download ${projectName} at url ${projectArchiveUrl}: ${err}`);
    }
};

export const removeVersionAndExtension = (fileName: string) => {
    const extensionSeparator = '.';
    const versionSeparator = '-';

    return fileName
        .split(extensionSeparator)
        .slice(0, -1)
        .join(extensionSeparator)
        .split(versionSeparator)
        .slice(0, -1)
        .join(versionSeparator);
};
