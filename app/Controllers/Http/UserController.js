'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {

  async index ({ response }) {
    try{
      const users = await User.all()

      return response.status(200).json(users)

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async store ({ request, response }) {

    try{
      const erroMessage = {
        'email.required': 'Esse campo é obrigatorio',
        'email.unique': 'Esse email já existe',
        'email.email': 'O campo deve estar em um formato de email',
        'password.required': 'Esse campo é obrigatorio',
        'password.min': 'A senha deve ter mais que 5 caracteres',
      }

      const validation = await validateAll(request.all(), {
        email: 'required|email|unique:users',
        password: 'required|min:6'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const data = request.only([
        "email",
        "password"
      ])

      const user = await User.create(data)

      return response.status(201).json(user);

    }catch (err){
      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }


  }

  async show ({ params, response }) {
    try{
      const user = await User.find(params.id)

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      return response.status(200).json(user)

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async update ({ params, request, response }) {
    try{
      const erroMessage = {
        'email.unique': 'Esse email já existe',
        'email.email': 'O campo deve estar em um formato de email',
        'password.min': 'A senha deve ter mais que 5 caracteres',
      }

      const validation = await validateAll(request.all(), {
        email: 'email|unique:users',
        password: 'min:6'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const user = await User.find(params.id)

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      const { email, password } = request.only([
        "email",
        "password"
      ])

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

  async destroy ({ params, response }) {
    try{
      const user = await User.find(params.id)

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      user.ativo = false
      await user.save()

      return response.status(204).send({message: 'Usuário foi desativado'})

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }
}

module.exports = UserController
