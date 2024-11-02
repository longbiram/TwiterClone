import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { deleteNotification, deleteSingleNotification, getNotifications } from '../controllers/notification.contoller.js';


const router = express.Router();

router.get("/",protectedRoute,getNotifications);
router.delete("/",protectedRoute,deleteNotification);
router.delete("/:id",protectedRoute,deleteSingleNotification);

export default router;