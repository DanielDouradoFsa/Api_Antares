'use strict'

const Database = use('Database')
const Pessoa = use('App/Models/Pessoa')
const User = use('App/Models/User')
const Escola = use('App/Models/Escola')
const Endereco = use('App/Models/Endereco')
const Bolsista = use('App/Models/Bolsista')
const Permissao = use('App/Models/Permissao')
const { validateAll } = use('Validator')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bolsistas
 */
class BolsistaController {
  /**
   * Show a list of all bolsistas.
   * GET bolsistas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new bolsista.
   * GET bolsistas/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new bolsista.
   * POST bolsistas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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
        cpf,
        email,
        telefone,
        matricula,
        ativo,
        gerir_bolsista,
        gerir_funcionario,
        agendamento,
        relatorio,
        cadastrar_atividade,
        gerir_horario_bolsista,
        gerir_backup,
        ver_escolas,
        meu_horario,
        agendar_visita,
        meus_agendamentos,
        editar_dados
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
        gerir_bolsista,
        gerir_funcionario,
        agendamento,
        relatorio,
        cadastrar_atividade,
        gerir_horario_bolsista,
        gerir_backup,
        ver_escolas,
        meu_horario,
        agendar_visita,
        meus_agendamentos,
        editar_dados
      })
      const bolsista = await Bolsista.create({
        pessoa_id: pessoa.id,
        user_id: user.id,
        permissao_id:permissao.id,
        matricula,
        ativo
      })

      await trx.commit()

      return response.status(201).send({message: 'Bolsista criada com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  /**
   * Display a single bolsista.
   * GET bolsistas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing bolsista.
   * GET bolsistas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update bolsista details.
   * PUT or PATCH bolsistas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a bolsista with id.
   * DELETE bolsistas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = BolsistaController
