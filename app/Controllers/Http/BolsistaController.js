'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bolsistas
 */

const Database = use('Database')
const Pessoa = use('App/Models/Pessoa')
const User = use('App/Models/User')
const Escola = use('App/Models/Escola')
const Endereco = use('App/Models/Endereco')
const Bolsista = use('App/Models/Bolsista')
const Permissao = use('App/Models/Permissao')
const { validateAll } = use('Validator')

class BolsistaController {

  async index ({ response }) {

    try{
      const bolsistas = await Bolsista
        .query()
        .with('pessoa')
        .with('usuario', (builder) => {
          builder.where('ativo', true)
        })
        .fetch()

      return response.status(200).json(bolsistas)

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
        'numero.integer': 'Informe um valor inteiro',
        'nome.required': 'Esse campo é obrigatório',
        'telefone.required': 'Esse campo é obrigatório',
        'telefone.integer': 'Informe um valor inteiro',
        'email.required': 'Esse campo é obrigatório',
        'email.email': 'Informe um email válido',
        'cpf.required': 'Esse campo é obrigatório',
        'cpf.integer': 'Informe um valor inteiro',
        'matricula.required': 'Esse campo é obrigatório',
        'matricula.integer': 'Informe um valor inteiro',
        'meu_horario.boolean': 'Informe um valor boleano',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        password: 'required|min:6',
        estado: 'required',
        cidade: 'required',
        bairro: 'required',
        rua: 'required',
        numero: 'required|integer',
        nome: 'required',
        telefone: 'required|integer',
        email: 'required|email',
        cpf: 'required|integer',
        matricula: 'required|integer',
        meu_horario: 'boolean'
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
        cpf,
        email,
        telefone,
        matricula,
        meu_horario
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

      const pessoa = await Pessoa.create({
        nome,
        cpf,
        email,
        telefone,
        endereco_id: endereco.id
      }, trx)

      const permissao = await Permissao.create({
        user_id:user.id,
        meu_horario
      }, trx)

      const bolsista = await Bolsista.create({
        pessoa_id: pessoa.id,
        user_id: user.id,
        permissao_id:permissao.id,
        matricula
      }, trx)

      await trx.commit()

      return response.status(201).send({message: 'Bolsista criado com sucesso'});

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

module.exports = BolsistaController
