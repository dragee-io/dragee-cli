import axios from "axios";
import { config } from './../cli.config.ts'

export const downloadProjectAndGetName = async (projectName: string, projectsDirectory: string) => {
    const projectArchiveUrl = `${config.projectsRegistryUrl}/${projectName}/latest`;
    let fileName;

    try{
        const {data} =  await axios.get<any>(
            projectArchiveUrl,
            {
                headers: {
                    Accept: 'application/json'
                },
            },
        );

        fileName = data.dist.tarball.split('/').pop();
        const directoryName = removeVersionAndExtension(fileName);
        let downloadedArchive;

        downloadedArchive = await axios.get<any>(data.dist.tarball, {
            responseType: 'arraybuffer'
        })

        await Bun.write(`${projectsDirectory}/${directoryName}/${fileName}`, downloadedArchive.data);
        console.log(`Project ${projectName} has been downloaded`)

    }catch(err){
        throw Error(`Could not download ${projectName} at url ${projectArchiveUrl}: ${err}`)
    }

    return fileName;
}

export const removeVersionAndExtension = (fileName: string) => {
    const extensionSeparator = ".";
    const versionSeparator = "-";

    return fileName
        .split(extensionSeparator)
        .slice(0, -1)
        .join(extensionSeparator)
        .split(versionSeparator)
        .slice(0, -1)
        .join(versionSeparator);
}