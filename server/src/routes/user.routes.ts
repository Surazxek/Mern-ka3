import express from 'express'
import { getAll, getById, remove, updateUser, } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { allAdmins } from '../types/global.types';

const router = express.Router();

router.get('/',authenticate(allAdmins),getAll)
router.get('/:id', getById)
router.delete('/:id', authenticate(allAdmins), remove)
router.put('/:id',authenticate(allAdmins), updateUser)


export default router;