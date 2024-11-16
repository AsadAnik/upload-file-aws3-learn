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

/**
 * @desc Global error handler
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export const globalErrorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
};

