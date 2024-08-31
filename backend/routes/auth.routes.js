import express from 'express';
import { getUser, login, logout, signup } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const routes = express.Router();

routes.get("/user",protectedRoute,getUser);

routes.post("/signup",signup);

routes.post("/login",login);

routes.post("/logout",logout);

export default routes;