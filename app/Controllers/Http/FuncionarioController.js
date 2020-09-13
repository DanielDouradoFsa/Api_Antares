'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with funcionarios
 */

const Database = use("Database")
const Funcionario = use('App/Models/Funcionario')
const User = use('App/Models/User')
const Escola = use('App/Models/Escola')
const Endereco = use('App/Models/endereco')
const Pessoa =  use('App/Models/Pessoa')
const { validateAll } = use('Validator')

class FuncionarioController {

  async index ({ request, response, view }) {
    return await Database
      .table('funcionarios')
      .where('ativo', '0')

    try{
      const funcionarios = await Database
        .table('funcionarios')
        .where('ativo', '0')

      return response.status(200).json(funcionarios)

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try{
      const erroMessage = {
        'username.required': 'Esse campo é obrigatório',
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.required': 'Esse campo é obrigatório',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
        'estado.required': 'Esse campo é obrigatório',
        'cidade.required': 'Esse campo é obrigatório',
        'bairro.required': 'Esse campo é obrigatório',
        'rua.required': 'Esse campo é obrigatório',
        'numero.required': 'Esse campo é obrigatório',
        'nome.required': 'Esse campo é obrigatório',
        'telefone.required': 'Esse campo é obrigatório',
        'email.required': 'Esse campo é obrigatório',
        'email.email': 'Informe um email válido',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        password: 'required|min:6',
        estado: 'required',
        cidade: 'required',
        bairro: 'required',
        rua: 'required',
        numero: 'required',
        nome: 'required',
        telefone: 'required',
        email: 'required|email',
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }
      const {
        username,
        password,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        nome,
        telefone,
        email,
        cpf,
        ativo
      } = request.all()
      console.log(username)
      const user = await User.create({
        username,
        password
      }, trx)

      const endereco = await Endereco.create({
        estado,
        cidade,
        bairro,
        rua,
        numero
      }, trx)

      const pessoa = await Pessoa.create({
        nome,
        cpf,
        email,
        telefone,
        endereco_id: endereco.id
      }, trx)

      const funcionario = await Funcionario.create({
        user_id: user.id,
        pessoa_id: pessoa.id,
        ativo: ativo
      }, trx)

      await trx.commit()

      return response.status(201).send({message: 'Funcionario criado com sucesso'});
    }catch (err) {
      return response.status(400).send({error: `Erro: ${err.message}`})
   }
  }

  async show ({ params, request, response, view, auth }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ response, auth }) {

    try{
      const funcionario = await Funcionario.find(auth.user.id)

      if(funcionario == null)
        return response.status(404).send({message: 'Funcionário não localizado'})

      funcionario.ativo = false
      await funcionario.save()

      return response.status(204).send({message: 'Funcionário foi desativado'})

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }
}

module.exports = FuncionarioController
