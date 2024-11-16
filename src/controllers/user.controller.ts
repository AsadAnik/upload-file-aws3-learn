import { NextFunction, Request, Response } from "express";

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
}

export default UserController;
