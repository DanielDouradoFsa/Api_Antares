'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database')
const Horario = use('App/Models/Horario')
const { validateAll } = use('Validator')

class HorarioController {

  async index ({ request, response, view }) {
  }

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
        bolsista_id: 'required|unique:horarios',
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

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = HorarioController
