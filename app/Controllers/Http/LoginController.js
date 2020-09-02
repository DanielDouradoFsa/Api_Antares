'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class LoginController {

  async login ({ request, response, auth }) {

    try{
      const { email, password } = request.all()
      const validaToken = await auth.attempt(email, password)

      return response.status(200).send(validaToken)

    }catch (err){
      return response.status(500).send({
        error: `Erro: ${err.message}`
      })
    }

  }

  async logout({ response, auth }) {
    try {
      await auth.logout()

      return response.status(200).send({
        message: 'Usuário desconectado'
      })
    } catch (error) {
      response.status(404).send('You are not logged in')
    }
  }

}

module.exports = LoginController
