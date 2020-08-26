'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Horario extends Model {

  bolsista() {
    return this.belongsTo('App/Models/Bolsista')
  }

  visita() {
    return this.belongsTo('App/Models/Visita')
  }

  atracao() {
    return this.belongsTo('App/Models/Atracao')
  }
}

module.exports = Horario
