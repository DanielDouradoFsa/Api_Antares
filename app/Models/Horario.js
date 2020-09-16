'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Horario extends Model {

  bolsista() {
    return this.belongsToMany('App/Models/Bolsista')
      .pivotTable('horario_bolsistas')
  }

  visita() {
    return this.belongsTo('App/Models/Visita')
  }

  atracao() {
    return this.belongsToMany('App/Models/Atracao')
      .pivotTable('horario_atracoes')
  }
}

module.exports = Horario
