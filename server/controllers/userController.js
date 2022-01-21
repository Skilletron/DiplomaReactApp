const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {User,Basket} = require('../models/models')

const generateJwt = (id,email,role)=>{
   return jwt.sign(
       {id,email,role},
        process.env.SECRET_KEY,

    )
}

class UserController{
    async registration(request, response, next){

            const {email, password, role} = request.body
            if (!email || !password) {
                return next(ApiError.badRequest('Неккоректный email'))
            }
            const candidate = await User.findOne({email})
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, role, password: hashPassword})
            const basket = await Basket.create({userId: user.id})
            const token = generateJwt(user.id, user.email, user.role)
            return response.json({token,basket})


        }



    async login(request, response,next) {

            const {email, password} = request.body
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.internal('Пользователь с таким именем не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Неверный пароль'))
            }
            const token = generateJwt(user.id, user.email, user.role)
            return response.json({token})

    }
    async check(request, response){
      const token = generateJwt(request.user.id,request.user.email,request.user.role)
        return  response.json({token})
    }

}

module.exports = new UserController()