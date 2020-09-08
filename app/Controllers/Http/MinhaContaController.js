'use strict'

const { validateAll } = use('Validator')

class MinhaContaController {

  async show ({ response, auth }) {
    try{
      await auth.check()

      const user = await auth.getUser()

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      return response.status(200).json(user)

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async update ({ params, request, response, auth }) {
    try{
      await auth.check()

      const erroMessage = {
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O username deve ter mais que 5 caracteres',
        'email.unique': 'Esse email já existe',
        'email.email': 'O campo deve estar em um formato de email',
        'password.min': 'O username deve ter mais que 5 caracteres',
      }

      const validation = await validateAll(request.all(), {
        username: 'min:5|unique:users',
        email: 'email|unique:users',
        password: 'min:6'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const user = await auth.getUser()

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      const { username, email, password } = request.only([
        "username",
        "email",
        "password"
      ])

      if( username != null )
        user.username = username
      if( password != null )
        user.password = password
      if( email != null )
        user.email = email

      await user.save()

      return response.status(200).json(user)

    }catch (err){
      return response.status(409).send({
        error: `Erro: ${err.message}`
      })
    }
  }

}

module.exports = MinhaContaController
