import dotenv from 'dotenv';
import azure from 'azure-storage';

dotenv.config();

const CONX_url = process.env.AZURE_STORAGE_CONNECTION_STRING;
const container = process.env.CONTAINER_NAME;
const blobService = azure.createBlobService(CONX_url);

export const UploadImagesAndGetUrl = async (file, context) => {
  try {

    let blobUrl=process.env.DEFAULT_BLOB;
    if (file) {
    const { createReadStream, filename } = await file;
    let streamSize = parseInt(context.req.headers['content-length']);
    const fileStream = createReadStream();

    blobService.createBlockBlobFromStream(container, filename, fileStream, streamSize, (error, response) => {
      if (!error) {
        console.log('true');
      }
    });
    blobUrl = blobService.getUrl(container, filename);
  }
    return blobUrl;
  } catch (error) {
    return null;
  }
};


export const deleteBlobFromUrl = (blobUrl) => {

    const defaultBlob=process.env.DEFAULT_BLOB;
    if (blobUrl!=defaultBlob){
    // Extract container name and blob name from the URL
    const urlParts = new URL(blobUrl);
    const containerName = urlParts.pathname.split('/')[1];
    const blobName = urlParts.pathname.split('/')[2];
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
  }
  };