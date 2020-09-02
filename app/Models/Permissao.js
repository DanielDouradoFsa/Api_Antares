'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permissao extends Model {

  usuario() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Permissao
