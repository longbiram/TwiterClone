import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

const routes = express.Router();

routes.post("/signup",signup);

routes.post("/login",login);

routes.post("/logout",logout);

export default routes;