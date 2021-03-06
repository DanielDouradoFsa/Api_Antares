'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Funcionario extends Model {

  pessoa() {
    return this.belongsTo('App/Models/Pessoa')
  }

  usuario() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Funcionario
