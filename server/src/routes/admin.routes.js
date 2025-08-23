

import express from 'express';

import {getUsers,createUser,updateUser,deleteUser,getJobs,createJob,updateJob,deleteJob,getApplications,updateApplication, getStats,getTrends, getRoles,errorHandler} from '../controllers/admin.controller.js'
import {protectAdmin } from '../middlewares/admin.middleware.js';
const router = express.Router();

router.get('/users',protectAdmin, getUsers);
router.post('/users',protectAdmin, createUser);
router.patch('/users/:id',protectAdmin, updateUser);
router.delete('/users/:id', deleteUser);

router.get('/jobs',protectAdmin, getJobs);
router.post('/jobs',protectAdmin, createJob);
router.patch('/jobs/:id',protectAdmin, updateJob);
router.delete('/jobs/:id',protectAdmin, deleteJob);

router.get('/applications',protectAdmin, getApplications);
router.patch('/applications/:id',protectAdmin, updateApplication);

router.get('/stats', getStats);
router.get('/stats/trends', getTrends);

router.get('/roles',protectAdmin, getRoles);

router.use(errorHandler);

export default router;
