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