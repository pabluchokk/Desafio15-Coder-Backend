import express from 'express'
import multer from 'multer';
import UserController from '../config/UserController.js'

const router = express.Router();
const userController = new UserController()

router.put('/premium/:uid', userController.changeUserRole)

router.post('/:uid/documents', upload.array('documents'), UserController.uploadDocuments)

router.post('/:uid/documents', upload.single('file', UserController.uploadDocuments ))

export default router