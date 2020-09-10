'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Endereco extends Model {

  static get hidden () {
    return ['id']
  }

  pessoa() {
    return this.hasOne('App/Models/Pessoa')
  }

  escola() {
    return this.hasOne('App/Models/Escola')
  }

}

module.exports = Endereco
