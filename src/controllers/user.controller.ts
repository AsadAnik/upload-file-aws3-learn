import { NextFunction, Request, Response } from "express";
import { aws } from '../lib';

class UserController {
    /**
     * @route POST /upload
     * @desc Upload a file
     * @access Public
     */
    public uploadFile(req: Request, res: Response, next: NextFunction): void {
        try {
            // req.file is the file that was uploaded
            console.log("REQ OBJECT HERE - ", req.file);

            res.status(200).json({
                message: "File Uploaded",
                file: req.file,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route POST /upload-multiple
     * @desc Upload multiple files
     * @param req
     * @param res 
     * @param next 
     */
    public uploadFiles(req: Request, res: Response, next: NextFunction): void {
        try {
            if (!req.files || req.files.length === 0) {
                throw new Error('No files upload or file types not allowed');
            }

            console.log('REQUEST FILES HERE - ', req.files);

            // Accessing the files here..
            const files = req.files as Express.Multer.File[];
            const fileDetails = files.map(file => {
                return {
                    originalName: file.originalname,
                    path: file.path,
                    mimeType: file.mimetype,
                    size: file.size,
                    serverDestination: file.destination,
                    // buffer: file.buffer, // This for memoryStorage.
                };
            });

            console.log('Uploaded Files: ', fileDetails);

            res.status(200).json({
                message: "Files uploaded successfully!",
                files: fileDetails,
            });

        } catch (error) {
            next(error);
        }
    }


    /**
     * @route POST /upload-multi-fields
     * @desc Upload files to multiple fields
     * @access Public
     */
    public uploadMultiFields(req: Request, res: Response, next: NextFunction): void {
        try {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };
            const profilePic = files['profilePic']?.[0]; // Single File
            const documents = files['documents'] || []; // Array of Files

            console.log('REQUEST FILES DATA: ', req.files);

            // Access files for `profilePic`
            const profilePicDetails = profilePic ? {
                originalName: profilePic.originalname,
                size: profilePic.size,
                mimeType: profilePic.mimetype,
                buffer: profilePic.buffer, // File data in memory
            }
                : null;

            // Access files for `documents`
            const documentDetails = documents.map((doc) => ({
                originalName: doc.originalname,
                size: doc.size,
                mimeType: doc.mimetype,
                buffer: doc.buffer,
            }));

            res.status(200).json({
                message: 'Files uploaded successfully!',
                profilePic: profilePicDetails,
                documents: documentDetails,
            });
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * @route POST /upload-cloud
     * @desc Upload file to cloud
     * @param req 
     * @param res 
     * @param next 
     */
    public async uploadToCloud(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
               throw new Error('No File Provided!');
            }

            const file = req.file.buffer; // Assuming multer memory storage
            const fileName = `${Date.now()}-${req.file.originalname}`;

            // Upload the file to S3
            const fileUrl = await aws.s3Uploader(file, fileName);

            res.status(200).json({
                message: 'File uploaded successfully',
                fileUrl,
            });

        } catch (error: any) {
            next(error);
        }
    }
}

export default UserController;
