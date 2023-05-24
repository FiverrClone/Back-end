
// import * as dotenv from 'dotenv';
// import azure  from 'azure-storage'

// dotenv.config();

// const CONX_url=process.env.AZURE_STORAGE_CONNECTION_STRING
// const container=process.env.CONTAINER_NAME
// const blobService = azure.createBlobService(CONX_url);


// export const UploadImagesAndGetUrl = async (file,context) => {
//     try {
//         const { createReadStream, filename, mimetype } = await file;
//         let streamSize = parseInt(context.req.headers['content-length'])
//         const fileStream = createReadStream()

//         blobService.createBlockBlobFromStream(container,filename,fileStream,streamSize,(error,response) => {
//             if(!error){
//               console.log(response)
//             }
//         })
//         const blobUrl = blobService.getUrl(container, filename);
//         return blobUrl;

//     } catch (error) {
//       return null;
//     }
//   };
import dotenv from 'dotenv';
import azure from 'azure-storage';

dotenv.config();

const CONX_url = process.env.AZURE_STORAGE_CONNECTION_STRING;
const container = process.env.CONTAINER_NAME;
const blobService = azure.createBlobService(CONX_url);

export const UploadImagesAndGetUrl = async (file, context) => {
  try {
    const { createReadStream, filename } = await file;
    let streamSize = parseInt(context.req.headers['content-length']);
    const fileStream = createReadStream();

    blobService.createBlockBlobFromStream(container, filename, fileStream, streamSize, (error, response) => {
      if (!error) {
        console.log(response);
      }
    });

    const blobUrl = blobService.getUrl(container, filename);
    return blobUrl;
  } catch (error) {
    return null;
  }
};


export const deleteBlobFromUrl = (blobUrl) => {
    // Extract container name and blob name from the URL
    const urlParts = azure.BlobUtilities.getUrlParts(blobUrl);
    const containerName = urlParts.container;
    const blobName = urlParts.blob;
  
    const blobService = azure.createBlobService();
  
    return new Promise((resolve, reject) => {
      blobService.deleteBlobIfExists(containerName, blobName, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };