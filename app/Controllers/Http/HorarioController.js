'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database')
const Horario = use('App/Models/Horario')
const Bolsista = use('App/Models/Bolsista')
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
        matricula: "required|exists:bolsistas,matricula",
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
        matricula,
        dia,
        horario_inicio,
        horario_fim,
      } = request.all()

      const bolsista = await Bolsista.findBy("matricula", request.body.matricula)

      const horarios = await Horario.create({
        bolsista_id:bolsista.id,
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
        matricula: 'required|exists:bolsistas,matricula',
        dia: 'integer',
        horario_inicio: 'max:6',
        horario_fim: 'max:6',
      }, erroMessage)

      if(validation.fails()){
        return response.status(405).send({
          message: validation.messages()
        })
      }
      const bolsista = await Bolsista.findBy("matricula", request.body.matricula)
      const horario = await Horario.findBy('bolsista_id', bolsista.id)
      console.log(horario)

      const horarioReq = request.only(["bolsista_id","dia","horario_inicio","horario_fim"])

      horario.merge({ ...horarioReq })

      await horario.save(trx)

      await trx.commit()

      return response.status(201).send({message: 'Horario alterado com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async destroy ({ params, request, response }) {
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
        matricula: 'required|exists:bolsistas,matricula',
        dia: 'integer',
        horario_inicio: 'max:6',
        horario_fim: 'max:6',
      }, erroMessage)

      if(validation.fails()){
        return response.status(405).send({
          message: validation.messages()
        })
      }
      const bolsista = await Bolsista.findBy("matricula", request.body.matricula)
      const horarioRef = await Database.from("horarios").where("bolsista_id",bolsista.id)
      .andWhere("horario_fim",request.body.horario_fim)
      .andWhere("horario_inicio",request.body.horario_inicio)
      .andWhere("dia",request.body.dia)
      .first()
      const horario = await Horario.findBy("id",horarioRef.id)
      
      if(!horario){
        return response.status(404).send({message: "Horario desejado não existe"})
      }
      await horario.delete()

      await horario.save(trx)

      await trx.commit()

      return response.status(201).send({message: 'Horario excluído com sucesso'});

    }catch (err){
      await trx.rollback()
      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }
}

module.exports = HorarioController
