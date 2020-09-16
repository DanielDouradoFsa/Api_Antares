'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Atracao extends Model {

  static get table () {
    return 'atracoes'
  }

  horario() {
    return this.belongsToMany('App/Models/Horario')
      .pivotTable('horario_atracoes')
  }

  visita() {
    return this.belongsTo('App/Models/Visita')
  }

}

module.exports = Atracao
