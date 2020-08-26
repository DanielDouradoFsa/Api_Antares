'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pessoa extends Model {

  bolsista() {
    return this.belongsTo('App/Models/Bolsista')
  }

  funcionario() {
    return this.belongsTo('App/Models/Funcionario')
  }

  endereco() {
    return this.hasOne('App/Models/Endereco')
  }
}

module.exports = Pessoa
