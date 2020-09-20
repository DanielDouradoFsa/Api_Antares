'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {

  async login ({ request, response, auth }) {

    try{
      const erroMessage = {
        'username.required': 'Esse campo é obrigatorio',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.required': 'Esse campo é obrigatorio',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5',
        password: 'required|min:6'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const { username, password } = request.only(['username', 'password'])
      console.log(username,password)
      const validaToken = await auth.attempt(username, password)
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

  async index ({ response }) {
    try{
      const users = await User.findBy('ativo', 1)

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
        'username.required': 'Esse campo é obrigatorio',
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.required': 'Esse campo é obrigatorio',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        password: 'required|min:6'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const data = request.only([
        "username",
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

  async update ({ params, request, response, auth }) {
    try{

      const user = await auth.getUser()

      const erroMessage = {
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
        'ativo.boolean': 'O campo é do tipo boolean',
      }

      const validation = await validateAll(request.all(), {
        username: `min:5|unique:users,username,id,${user.id}`,
        password: 'min:6',
        ativo: 'boolean'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      const { username, password, ativo } = request.only([
        "username",
        "password",
        "ativo"
      ])

      if( password != null )
        user.password = password
      if( username != null )
        user.username = username
      if( ativo != null )
        user.ativo = ativo

      await user.save()

      return response.status(200).send({message: 'Usuário atualizado com sucesso'})

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
