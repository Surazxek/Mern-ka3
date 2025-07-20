import express from 'express'
import { getAllCategory, getCategoryById, postCategory, removeCategory, updateCategory } from '../controllers/category.controller'

const router = express.Router()


router.post('/', postCategory)
router.get('/', getAllCategory)
router.get('/:id', getCategoryById)
router.delete('/:id', removeCategory)
router.put('/:id', updateCategory)


export default router