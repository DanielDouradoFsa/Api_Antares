'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with escolas
 */
const Database = use('Database')
const User = use('App/Models/User')
const Escola = use('App/Models/Escola')
const Endereco = use('App/Models/endereco')
const { validateAll } = use('Validator')

class EscolaController {

  async index ({ request, response }) {
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
        'nome_responsavel.required': 'Esse campo é obrigatório',
        'telefone_responsavel.required': 'Esse campo é obrigatório',
        'email.required': 'Esse campo é obrigatório',
        'email.email': 'Informe um email válido',
        'tipo.required': 'Esse campo é obrigatório',
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
        nome_responsavel: 'required',
        telefone_responsavel: 'required',
        email: 'required|email',
        tipo: 'required'
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
        nome_responsavel,
        telefone_responsavel,
        email,
        tipo
      } = request.all()

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

      const escola = await Escola.create({
        nome,
        telefone,
        nome_responsavel,
        telefone_responsavel,
        email,
        tipo,
        user_id: user.id,
        endereco_id: endereco.id
      }, trx)

      await trx.commit()

      return response.status(201).send({message: 'Escola criada com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }

  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = EscolaController
