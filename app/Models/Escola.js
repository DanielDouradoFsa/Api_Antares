'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Escola extends Model {

  usuario() {
    return this.hasOne('App/Models/User')
  }

  endereco() {
    return this.hasOne('App/Models/Endereco')
  }

  visita() {
    return this.belongsToMany('App/Models/Visita')
  }

}

module.exports = Escola
