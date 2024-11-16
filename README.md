# Advanced Upload File System & AWS-S3

[Lecture - 132 | NodeJS File Uploads | Full-stack Army](https://youtu.be/Il3c37lRQDM?si=wWabmGWOuQ2SNcVy)

⇒ Multer Package to using with Node

[npm: multer](https://www.npmjs.com/package/multer)

We are going to using Multer with our Node-JS project hands on. Now we have to see how can we grab a file from client side to server side via Multer.

Let’s installing the Multer like this way,

—> **`npm install --save multer`**

Now the questions comes in where should we keeping the Multer module into our project ? what is the best practices to keeping it. 

- **Simple Projects**: Place Multer configuration in `utils/` for simplicity.
- **Complex Projects**: Use `services/` if file uploads are tied to business logic, or `lib/` if you're building a wrapper for Multer or similar libraries.

The choice depends on your project size and modularity needs.

**⇒ So we are keeping the Multer inside `lib/` directory**

Also let’s see by using with first time we are going to uploading a file with that. 😇

- **`my-app/src/lib/multer.ts`**
    
    ```tsx
    import multer from 'multer';
    
    const upload = multer({
    	dest: "./uploads"
    });
    
    export default upload;
    ```
    

Now using the Multer middleware into the route to getting the file for req object.

**⇒ Route for using the uploader middleware here**

- **`my-app/src/routes/index.ts`**
    
    ```tsx
    import { Router, Request, Response } from 'express';
    import MulterUpload from '../lib';
    
    const router = Router();
    
    router.post("/files", upload.single('avatar'), (req: Request, res: Response) => {
    	try {
          // req.file is the file that was uploaded
          console.log("REQ OBJECT HERE - ", req.file);
          res.status(200).json({
    	      message: "File Uploaded",
    	       file: req.file,
          });
          
    	 } catch (error: any) {
    	   res.status(error.statusCode || 500).json({
    	    message: error.message || "Internal Server Error",
    	   });
      }
    });
    
    export default router;
    ```
    

**⇒ Here is the Response from Postman**

Also file is uploaded into the `uploads` directory into the project.

![Screenshot 2024-11-14 at 12.22.55 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e049a259-c8a0-4a67-b4af-2de23d3296ef/49063f74-d8aa-43c9-85c0-78ec4446bc21/Screenshot_2024-11-14_at_12.22.55_PM.png)

<aside>
💡

This file has no extension or any type given so we have to do something more into the Multer configuration. Also we needs a global error handler for Multer error catching.

</aside>

### Using Proper File Uploading with Node-JS (Express) TypeScript

Firstly, we have our server / application file of Express server with TypeScript here.

**⇒ Server File**

- **`my-app/src/app.ts`**
    
    ```tsx
    import express, { Application, Request, Response, NextFunction } from "express";
    import { userRoute } from "./routes";
    import { multerErrorHandler } from "./middlewares";
    
    const app: Application = express();
    
    // Common Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Routes
    app.use("/user", userRoute);
    
    app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
      res.status(404).json({
        message: "Not Found",
      });
    });
    
    // Error Handling Middleware
    app.use(multerErrorHandler);
    
    const PORT: number = Number(process.env.PORT) || 3000;
    const HOST: string = process.env.HOST || "localhost";
    
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on port ${HOST}:${PORT}`);
    });
    ```
    

**⇒ Now our Multer Config as Library Module**

- **`my-app/src/lib/multer.ts`**
    
    ```tsx
    import multer from "multer";
    
    const upload = multer({
      dest: "uploads/",
    });
    
    export default upload;
    ```
    

**⇒ Error Handler Middleware for Multer Global**

- **`my-app/src/middlewares/error.middleware.ts`**
    
    ```tsx
    import { Request, Response, NextFunction } from "express";
    import { MulterError } from "multer";
    
    /**
     * @desc Handle multer errors
     * @param error 
     * @param req 
     * @param res 
     * @param next 
     */
    export const multerErrorHandler = (
        error: Error, 
        _req: Request, 
        res: Response, 
        next: NextFunction
    ) => {
        if (error instanceof MulterError) {
            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                res.status(400).json({
                    message: 'Unexpected field name. Please use "avatar" as the field name for file upload.',
                    error: error.message,
                });
    
            } else {
                res.status(400).json({
                    message: "File upload failed",
                    error: error.message,
                });
            }
        }
    
        next(error);
    };
    ```
    

**⇒ Proper Route for files upload with User resource**

- **`my-app/src/routes/user.route.ts`**
    
    ```tsx
    import { Router } from "express";
    import { upload } from "../lib";
    import { UserController } from "../controllers";
    const router: Router = Router();
    
    // Initialize the controller
    const userController: UserController = new UserController();
    
    /**
     * @route POST /upload
     * @desc Upload a file
     * @access Public
     */
    router.post("/upload", upload.single("avatar"), userController.uploadFile);
    
    export default router;
    ```
    

**⇒ Mainly here is our Controller as of now we never used Service**

There is no any extra business logics, therefore we used only Controller to manage the request directly here and give us the response of file.

- **`my-app/src/controllers/user.controller.ts`**
    
    ```tsx
    import { Request, Response } from "express";
    
    class UserController {
        /**
         * @route POST /upload
         * @desc Upload a file
         * @access Public
         */
        public uploadFile(req: Request, res: Response): void {
           try {
                // req.file is the file that was uploaded
                console.log("REQ OBJECT HERE - ", req.file);
                res.status(200).json({
                    message: "File Uploaded",
                    file: req.file,
                });
            } catch (error: any) {
                res.status(error.statusCode || 500).json({
                    message: error.message || "Internal Server Error",
                });
            }
        }
    }
    
    export default UserController;
    ```
    

<aside>
💡

Well here we can upload any files into our application with the help of Multer. Now we have to keep looking the Multer documentation’s to see more options of validation or manipulation of Multer what features are there and what can it do more.

</aside>

**⇒ Multer Doc. by Geekster**

[Introduction to Multer With Example](https://www.geekster.in/articles/introduction-to-multer/)

⇒ Multer In Details Doc. by **LogRocket**

[Multer: Easily upload files with Node.js and Express - LogRocket Blog](https://blog.logrocket.com/multer-nodejs-express-upload-file/)

⇒ Common **MimeTypes** for uploader

[Common MIME types - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types)

### Advance options with Multer configurations

We are going to use the advance options for Multer configurations with. And here we can see there using file `limits` represents the limitation of size for each files which we are going to uploading, `fileFilter` is for filtering the files for checking with mimetype or checking with if we are going to uploading different types of files which are are requiring.

- **`my-app/src/lib/multer.ts`**
    
    ```tsx
    import multer from 'multer';
    
    const upload = multer({
    	dest: "./uploads",
    	limit: {
    		fileSize: 5000000, // 5 MB. (Always takes bytes)
    	},
    	
    	fileFilter: (_req, file, cb) => {
    		const fileName = file.mimetype;
    		
    		if (fileName === "image/png" || fileName === "image/jpeg" || fileName === "image/jpg") {
    			cb(null, true);
    		} else {
    			cb(new Error("Invalid file type"));
    		}
    	}
    });
    ```
    

<aside>
💡

Its filters only the image like `png` , `jpeg` and `jpg` formats. Any other format will not be supporting by doing the filter thing. Also added the size limit for each of the files, this will be 5MB of size only supports limit.

</aside>

**Storage adding:** We can adding memory for file uploading through storage. And there is 2 types of storage engines like `DiskStorage` and `MemoryStorage`.

- 1. **`diskStorage`**
    - **What it does**: Stores the uploaded files directly on the server's file system.
    - **How it works**:
        - You can specify the directory where files will be stored (`destination`).
        - You can define the file naming logic (`filename`).
    - **Use Cases**:
        - Best suited for **large files** such as **images, videos, audios, or PDFs** that need to be stored persistently.
        - Ideal if you want to process and then move the file to cloud storage (e.g., AWS S3, Google Cloud Storage).
    - **Advantages**:
        - Files are saved immediately to disk, minimizing memory consumption.
        - Suitable for handling large file uploads without overwhelming server memory.
    - **Disadvantages**:
        - Requires server storage space, which can fill up if not managed properly.
        - Potential performance issues for high-traffic applications if files are stored on local disk instead of external storage.
    - **Configuration Example**:
        
        ```tsx
        import multer from 'multer';
        
        const storage = multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, './uploads'); // Directory to save files
          },
          filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // Custom file name
          },
        });
        
        const upload = multer({ storage });
        
        export default upload;
        ```
        
- 2. **`memoryStorage`**
    - **What it does**: Stores the uploaded files in the server's memory as a Buffer object.
    - **How it works**:
        - Files are kept in memory (RAM) temporarily.
        - You access the file data through `req.file.buffer` for further processing.
    - **Use Cases**:
        - Best for **temporary files** or when you need to process the file (e.g., resize images, parse CSV, or upload directly to a cloud storage service).
        - Suitable for smaller file uploads or when the file is uploaded and processed immediately, without needing to store it persistently.
    - **Advantages**:
        - Faster access to file data as it's in memory.
        - No need to manage local storage, making it ideal for stateless or cloud-first applications.
    - **Disadvantages**:
        - Limited by available server memory (RAM), making it unsuitable for large files.
        - Files are lost if the server restarts or crashes before they are processed.
    - **Configuration Example**:
        
        ```tsx
        import multer from 'multer';
        
        const storage = multer.memoryStorage();
        
        const upload = multer({ storage });
        
        export default upload;
        ```
        
        <aside>
        💡
        
        Files are stored as `Buffer` in memory, accessible through `req.file.buffer`. No `destination` or `filename` logic is required since the file is not saved on the disk.
        
        </aside>
        

**⇒ Which to Use for Specific File Types**

| **File Type** | **Recommended Storage** | **Reason** |
| --- | --- | --- |
| **Images** | `diskStorage` or `memoryStorage` | Use `diskStorage` for persistent storage; `memoryStorage` if resizing or uploading to the cloud. |
| **Videos** | `diskStorage` | Videos are large; storing in memory can overwhelm server RAM. |
| **Audio** | `diskStorage` | Similar to videos, audio files are better suited for disk-based storage. |
| **PDFs/Documents** | `diskStorage` | PDFs are typically not processed immediately, so storing on disk is more efficient. |
| **Temporary Files** | `memoryStorage` | Use if you process and discard the file without storing it. |

**⇒ Key Considerations for Choosing**

1. **File Size**:
    - **Small Files**: Both `diskStorage` and `memoryStorage` work.
    - **Large Files**: Use `diskStorage` to avoid running out of memory.
2. **Processing Needs**:
    - Use `memoryStorage` for files that need immediate processing (e.g., resizing images, sending to cloud).
3. **Persistence**:
    - Use `diskStorage` for files that need to be stored locally before being moved elsewhere.
4. **Server Resources**:
    - Consider your server's RAM and disk capacity to avoid bottlenecks.

**⇒ Hybrid Approach**

For a balanced approach:

1. Use `memoryStorage` for **small files** or files that are processed immediately.
2. Use `diskStorage` for **large files** and then offload them to cloud storage or a CDN.

Let me know if you need help setting up a specific use case!