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
    return this.hasMany('App/Models/Horario')
  }

}

module.exports = Bolsista
