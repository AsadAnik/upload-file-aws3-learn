import { Router } from "express";
import { singleUpload, multipleUpload, multiFieldUpload, cloudUpload } from "../lib";
import { UserController } from "../controllers";
const router: Router = Router();

// Initialize the controller
const userController: UserController = new UserController();

/**
 * @route POST /upload
 * @desc Upload a file
 * @access Public
 */
router.post("/upload", singleUpload, userController.uploadFile);

/**
 * @route POST /upload-multiple
 * @desc Upload multiple files
 * @access Public
 */
router.post("/upload-multiple", multipleUpload, userController.uploadFiles);

/**
 * @route POST /upload-multiple
 * @desc Upload multiple files
 * @access Public
 */
router.post("/upload-fields", multiFieldUpload, userController.uploadMultiFields);

/**
 * @route POST /upload-cloud
 * @desc Upload to Cloud Storage
 * @access Public
 */
router.post("/upload-cloud", cloudUpload, userController.uploadToCloud);

export default router;