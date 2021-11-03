import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    ContainerItem,
    BlobGenerateSasUrlOptions,
    BlobSASPermissions,
    SASProtocol,
    ContainerClient,
    ServiceListContainersOptions
  } from "@azure/storage-blob";

import moment from 'moment';

export class ImageStorageController {
   
    public constructor() {
    }
   
    public async getContainers(accountName: string, accountKey: string)  {
      
      try
      {
        // Use StorageSharedKeyCredential with storage account and account key
        // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
      
        // List containers
        const blobServiceClient = new BlobServiceClient(
          `https://${accountName}.blob.core.windows.net`,
          sharedKeyCredential
        );

        const opts : ServiceListContainersOptions = { includeMetadata: true, includeDeleted:false };

        const iter = await blobServiceClient.listContainers(opts);

        const containerItemArray: ContainerItem[] = [];

        let containerItem = await iter.next();
        while (!containerItem.done) {
          let item: ContainerItem = containerItem.value;

          if ((item.metadata) && (item.metadata.show))
          {
            if (item.metadata.show.toLowerCase() === 'true')
            {
              containerItemArray.push(item);  
            }
          }
          else
          {
            containerItemArray.push(item);
          }

          containerItem = await iter.next();
        }

        return containerItemArray;
      }

      catch(err)
      {
        console.error(err);
      }

      return [];
    }

    public async getContainerBlobs(accountName: string, accountKey: string, containerName: string)  {
      
        try
        {
            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

            const blobServiceClient = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net`,
                sharedKeyCredential
              );

              const containerClient: ContainerClient = await blobServiceClient.getContainerClient(containerName);

              const containerBlobArray = [];

              let blobs = containerClient.listBlobsFlat();

              for await (const blob of blobs) {
                
                if (!blob.deleted)
                {
                    const blobSASUrl = await this.getBlobReadOnlySASUrl(containerClient, blob.name);

                    containerBlobArray.push ( { name: blob.name, properties: blob.properties, snapshot: blob.snapshot, url: blobSASUrl });
                }
              }

              return containerBlobArray;

        }
        catch(err)
        {
            //TODO: ...
        }
    }

    public async getContainerSrcBlobs(accountName: string, accountKey: string, containerName: string)  {
      
      try
      {
          const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

          const blobServiceClient = new BlobServiceClient(
              `https://${accountName}.blob.core.windows.net`,
              sharedKeyCredential
            );

            const containerClient: ContainerClient = await blobServiceClient.getContainerClient(containerName);

            const containerBlobArray = [];

            let blobs = containerClient.listBlobsFlat();

            for await (const blob of blobs) {
              
              if (!blob.deleted)
              {
                  const blobSASUrl = await this.getBlobReadOnlySASUrl(containerClient, blob.name);

                  containerBlobArray.push ( { src: blobSASUrl });
              }
            }

            return containerBlobArray;

      }
      catch(err)
      {
          //TODO: ...
      }
  }

    public async getBlobReadOnlySASUrl(containerClient: ContainerClient, blobName: string)  {
      
        try
        {
              const blobClient = await containerClient.getBlobClient(blobName);

              const blobSasUrlOptions: BlobGenerateSasUrlOptions = {};

              const blobAccessPermission: BlobSASPermissions = new BlobSASPermissions();
              blobAccessPermission.read = true;
              
              blobSasUrlOptions.permissions = blobAccessPermission;
              blobSasUrlOptions.protocol = SASProtocol.Https;

              //
              const fromUTCMoment : moment.Moment = moment().utc();
              const toUTCMoment = fromUTCMoment.clone();  

              toUTCMoment.add(1, 'days');

              blobSasUrlOptions.expiresOn = toUTCMoment.toDate(); 
              return blobClient.generateSasUrl(blobSasUrlOptions);

        }
        catch(err)
        {
            //TODO: ...
        }
    
    }

    public async getBlob(accountName: string, accountKey: string, containerName: string, blobName: string)  {
      
        try
        {
            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

            const blobServiceClient = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net`,
                sharedKeyCredential
              );

              const containerClient = await blobServiceClient.getContainerClient(containerName);
              const blobClient = await containerClient.getBlobClient(blobName);

              const blobSasUrlOptions: BlobGenerateSasUrlOptions = {};

              const blobAccessPermission: BlobSASPermissions = new BlobSASPermissions();
              blobAccessPermission.read = true;
              
              blobSasUrlOptions.permissions = blobAccessPermission;
              blobSasUrlOptions.protocol = SASProtocol.Https;

              //
              const fromUTCMoment : moment.Moment = moment().utc();
              const toUTCMoment = fromUTCMoment.clone();  

              toUTCMoment.add(1, 'days');

              blobSasUrlOptions.expiresOn = toUTCMoment.toDate(); 
              return blobClient.generateSasUrl(blobSasUrlOptions);

        }
        catch(err)
        {
            //TODO: ...
        }
    
    }

    // private createReadOnlySharedAccessToken(accountName: string, containerName: string, blobName: string,
    //      saName: string, saKey: string) : string { 
        
    //         if (!accountName || !containerName || !blobName || !saName || !saKey) { 
    //         throw "Missing required parameter"; 
    //     } 
        
    //     const downloadUri = 
    //         `https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}?ss=b&sp=r&spr=https&sv=2020-08-04`
        
    //     const downloadUriEnc = encodeURIComponent(downloadUri);

    //     //REVIEW: UTCNOW DATE
    //     var now = new Date(); 
    //     //var week = 60*60*24*7;
    //     var day = 60*60*24*1;
    //     var ttl = Math.round(now.getTime() / 1000) + day;
        
    //     var signature = downloadUriEnc + '\n' + ttl; 
    //     var signatureUTF8 = utf8.encode(signature);

    //     var hash = createHmac('sha256', saKey).update(signatureUTF8).digest('base64');

    //     return {}
    //     return 'SharedAccessSignature sr=' + encoded + '&sig=' +  
    //         encodeURIComponent(hash) + '&se=' + ttl + '&skn=' + saName; 
    // }
    // private async streamToBuffer(readableStream) {
    //     return new Promise((resolve, reject) => {
    //       const chunks = [];
    //       readableStream.on("data", (data) => {
    //         chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    //       });
    //       readableStream.on("end", () => {
    //         resolve(Buffer.concat(chunks));
    //       });
    //       readableStream.on("error", reject);
    //     });
    // }

  }