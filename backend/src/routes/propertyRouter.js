import express from 'express';
import { getProperties, getProperty} from '../controller/propertyController.js';

const propertyRouter = express.Router();
propertyRouter.route('/listing').get(getProperties);
propertyRouter.route(('/listing/:id')).get(getProperty)

export { propertyRouter};