'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database')
const Horario = use('App/Models/Horario')
const { validateAll } = use('Validator')

/**
 * Resourceful controller for interacting with horarios
 */
class HorarioController {
  /**
   * Show a list of all horarios.
   * GET horarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new horario.
   * GET horarios/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new horario.
   * POST horarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try{
      const erroMessage = {
        'bolsista_id.required': 'Esse campo é obrigatório',
        'bolsista_id.unique': 'Esse horário já foi utilizado',
        'dia.required': 'Esse campo é obrigatório',
        'horario_inicio.required': 'Esse campo é obrigatório',
        'horario_fim.required': 'Esse campo é obrigatório',
      }
      const validation = await validateAll(request.all(), {
        bolsista_id: 'required|unique:Horarios',
        dia: 'required',
        horario_inicio: 'required',
        horario_fim: 'required',
      }, erroMessage)

      if(validation.fails()){
        return response.status(405).send({
          message: validation.messages()
        })
      }

      const {
        bolsista_id,
        dia,
        horario_inicio,
        horario_fim,
      } = request.all()

      const horarios = await Horario.create({
        bolsista_id:bolsista_id,
        dia,
        horario_inicio,
        horario_fim
      }, trx)

      await trx.commit()

      return response.status(201).send({message: 'Bolsista criado com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  /**
   * Display a single horario.
   * GET horarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing horario.
   * GET horarios/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update horario details.
   * PUT or PATCH horarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a horario with id.
   * DELETE horarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = HorarioController
