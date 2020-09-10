'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Escola extends Model {

  static get hidden () {
    return ['id', "user_id", "endereco_id"]
  }

  usuario() {
    return this.belongsTo('App/Models/User')
  }

  endereco() {
    return this.belongsTo('App/Models/Endereco')
  }

  visita() {
    return this.belongsToMany('App/Models/Visita')
  }

}

module.exports = Escola
