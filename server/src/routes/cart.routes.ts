


import express from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import { OnlyUser } from '../types/global.types'
import { create, getCart, removeFromCart } from '../controllers/cart.controller'


const router =express.Router()

router.post('/',authenticate(OnlyUser), create)
router.get('/',authenticate(OnlyUser), getCart)
router.delete('/',authenticate(OnlyUser),removeFromCart)


export default router