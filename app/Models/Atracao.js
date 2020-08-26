'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Atracao extends Model {

  horario() {
    return this.hasMany('App/Models/Horario')
  }

  visita() {
    return this.belongsTo('App/Models/Visita')
  }

}

module.exports = Atracao
