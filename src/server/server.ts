//Dependencies declarations
import express from 'express'; // Web application/services engine
import cors from 'cors';
import { ImageStorageController } from './imageStorageController';

//initialization
const app = express();

app.use(cors());
app.use(express.json());


//Serve static files from the local directory
app.use('/', express.static(`${__dirname}/../client`));

//app.get('/', (req, res) => { res.send("Hello World - 12.18.0"); } );

const port = process.env.PORT || 4999;

const imageStorageController = new ImageStorageController();

const accountName: string = process.env.STAMP_COLLECT_ACCOUNT_NAME || "";
const accountKey: string = process.env.STAMP_COLLECT_ACCOUNT_KEY || "";

app.get("/container", async (req, res) => { 

    const containerArray = await imageStorageController.getContainers(accountName, accountKey);
    res.json(containerArray);

});

app.get("/container/:containerName/blobs/", async (req, res) => { 

    const containerName:string = req.params.containerName;
    const containerArray = await imageStorageController.getContainerBlobs(accountName, accountKey, containerName);
    res.json(containerArray);

});

app.get("/container/:containerName/items/", async (req, res) => { 

    const containerName:string = req.params.containerName;
    const containerArray = await imageStorageController.getContainerSrcBlobs(accountName, accountKey, containerName);
    res.json(containerArray);

});

app.get("/container/:containerName/blobs/:blobName", async (req, res) => { 

    const containerName:string = req.params.containerName;
    const blobName:string = req.params.blobName;

    const containerArray = await imageStorageController.getBlob(accountName, accountKey, containerName, blobName);
    res.json(containerArray);

});

app.set('port', port);
app.listen(port, () => {
    console.log(`Servewr is listening on port ${port}`);
});
