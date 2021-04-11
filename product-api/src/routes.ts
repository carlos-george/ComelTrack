import express from 'express';
import multer from 'multer';

import auth from './middlewares/auth';
import multerConfig from './config/multer';
import PackageController from './controllers/PackageController';
import TrackerMailController from './controllers/TrackerMailController';

import UserController from './controllers/UserController';
import ProductController from './controllers/ProductController';

const uploade = multer(multerConfig);
const routes = express.Router();

const packageController = new PackageController();
const trackerMail = new TrackerMailController();

routes.get('/packages', packageController.index);

routes.get('/packages/:id', packageController.show);

routes.post('/packages', uploade.single('file'), packageController.create);

routes.post('/products', uploade.array('file'), ProductController.create);

routes.post('/dweller-packages', packageController.dwellerCreate);

routes.put('/packages/:id/delivery', packageController.delivery);

routes.delete('/packages/:id', packageController.delete);

routes.get('/trackerMail/:trackerNumber', trackerMail.tracker);

// Products routes

routes.get('/products', ProductController.index)

// Roues for User
routes.post('/users/register', UserController.register);

routes.post('/users/authenticate', UserController.authenticate);

routes.get('/users', UserController.index);

// routes.post('/packages', auth, userController.createPackage);

// routes.get('/packages', auth, userController.listPackages);

// routes.get('/packages/:id', auth, userController.showPackage);

export default routes;