import express from 'express'
import { getAll, getById, removeUser, } from '../controllers/user.controller';

const router = express.Router();

router.get('/',getAll)
router.get('/:id', getById)
router.delete('/:id', removeUser)
// router.put('/:id', updateUser)


export default router;