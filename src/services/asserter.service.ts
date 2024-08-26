import axios from "axios";

export async function downloadAsserterAndGetName (namespace: string, assertersDirectory: string) {
    const asserterArchiveUrl = `https://registry.npmjs.org/@dragee-io/${namespace}-asserter/latest`;
    let fileName;

    try{

        const {data} =  await axios.get<any>(
            asserterArchiveUrl,
            {
                headers: {
                Accept: 'application/json',
                },
            },
        );

        fileName =  data.dist.tarball.split('/').pop();
        const directoryName = removeVersionAndExtension(fileName);
        let downloadedArchive;

        downloadedArchive = await axios.get<any>(data.dist.tarball, {
            responseType: 'arraybuffer'
        })

        await Bun.write(`${assertersDirectory}/${directoryName}/${fileName}`, downloadedArchive.data);
        console.log(`Asserter ${namespace}-asserter has been downloaded`)

    }catch(err){
        throw Error(`Could not download ${namespace}-asserter at url ${asserterArchiveUrl}: ${err}`)
    }

    return fileName;
}

export function removeVersionAndExtension (fileName: string){
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