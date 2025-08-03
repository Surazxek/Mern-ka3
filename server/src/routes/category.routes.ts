import express from 'express'
import { getAllCategory, getCategoryById, postCategory, removeCategory, updateCategory } from '../controllers/category.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { allAdmins } from '../types/global.types'

const router = express.Router()


router.post('/',authenticate(allAdmins), postCategory)
router.get('/', getAllCategory)
router.get('/:id', getCategoryById)
router.delete('/:id',authenticate(allAdmins), removeCategory)
router.put('/:id',authenticate(allAdmins), updateCategory)


export default router
