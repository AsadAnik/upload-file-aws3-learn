
// ============================ AWS V2 SDK =============================
// import AWS from 'aws-sdk';

import S3 from 'aws-sdk/clients/s3';

const s3Bucket = new S3({
	accessKeyId: process.env.ACCESS_KEY,
	secretAccessKey: process.env.SECRET_KEY,
	region: process.env.REGION,
	endpoint: process.env.ENDPOINT,
	s3ForcePathStyle: true,
});

/**
 * UPLOADER OF S3 BUCKET
 * @param {Buffer | String} file
 * @param {String} fileName 
 * @returns 
 */
const s3Uploader = async(file: Buffer | string, fileName: string) => {
    const bucketName = process.env.BUCKET_NAME;

    if (!bucketName) {
        throw new Error('S3 Bucket name is not defined in the env.');
    }

	const params = {
		Bucket: bucketName,
		Key: fileName,
		Body: file,
		ACL: "public-read",
	};
	
	try {
		const uploadResult = await s3Bucket.upload(params).promise();
		console.log('File uploaded successfully: ', uploadResult.Location);
		return uploadResult.Location; // Return the file URL
	
	} catch(error) {
		console.error(`Error uploading to s3: ${error}`);
		throw new Error('Failed to upload file to s3');
	}
};

export default s3Uploader;


// ============================ AWS V3 SDK =============================

// import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

// const s3Client = new S3Client({
//     region: process.env.REGION as string,
//     endpoint: process.env.ENDPOINT as string,
//     credentials: {
//         accessKeyId: process.env.ACCESS_KEY as string,
//         secretAccessKey: process.env.SECRET_KEY as string,
//     },
// });

// /**
//  * UPLOADER OF S3 BUCKET
//  * @param {Buffer | String} file
//  * @param {String} fileName 
//  * @returns 
//  */
// const s3Uploader = async (file: Buffer | string, fileName: string): Promise<string> => {
//     const bucketName = process.env.BUCKET_NAME;
    
//     if (!bucketName) {
// 	    throw new Error('S3 Bucket name is not defined in the env.');
//     }
    
//     const params = {
//         Bucket: bucketName,
//         Key: fileName, // Use fileName as the key
//         Body: file,
//         ACL: "public-read" as ObjectCannedACL,
//     };
    
//     try {
// 	    const command = new PutObjectCommand(params);
// 	    await s3Client.send(command);
	    
// 	    const publicURL: string = `${process.env.ENDPOINT}${bucketName}/${fileName}`;
// 	    console.log(`File Uploaded Successfully: ${publicURL}`);
// 	    return publicURL; // Return the file URL
    
//     } catch (error) {
// 	    console.error(`Error uploading to s3: ${error}`);
// 		throw new Error('Failed to upload file to s3');
//     }
// };

// export default s3Uploader;