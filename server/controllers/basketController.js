const {BasketDevice} = require('../models/models')
class BasketController{

    async post(request, response){
        const  {basketId,deviceId} = request.body
        const basket = await BasketDevice.create({basketId,deviceId})
        return response.json(basket)
    }
    async getCurrentBasket(request, response){
        const  {basketId} = request.body
        const basket = await BasketDevice.findAll(
            {
                where: {basketId}
            })
        return response.json(basket)
    }

}

module.exports = new BasketController()