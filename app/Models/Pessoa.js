'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pessoa extends Model {

  bolsista() {
    return this.hasOne('App/Models/Bolsista')
  }

  funcionario() {
    return this.hasOne('App/Models/Funcionario')
  }

  endereco() {
    return this.belongsTo('App/Models/Endereco')
  }
}

module.exports = Pessoa
