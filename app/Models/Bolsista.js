'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Bolsista extends Model {

  pessoa() {
    return this.belongsTo('App/Models/Pessoa')
  }

  usuario() {
    return this.belongsTo('App/Models/User')
  }

  horario() {
    return this.belongsToMany('App/Models/Horario')
      .pivotTable('horario_bolsistas')
  }

}

module.exports = Bolsista
