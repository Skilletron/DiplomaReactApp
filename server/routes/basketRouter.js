const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')


router.get('/',basketController.getCurrentBasket)
router.post('/',basketController.post)

module.exports = router