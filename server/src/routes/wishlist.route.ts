import express from 'express'
import { addWishlist, clearWishList, getWishlist } from '../controllers/wishlist.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { allAdmins, OnlyUser } from '../types/global.types'


const router = express.Router()


router.get('/',authenticate(OnlyUser),getWishlist)
router.post('/',authenticate(OnlyUser),addWishlist)
router.delete('/',authenticate(allAdmins),clearWishList)




export default router
