'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Visita extends Model {

  escola() {
    return this.hasOne('App/Models/Escola')
  }

  horario() {
    return this.hasOne('App/Models/Horario')
  }

  atracao() {
    return this.hasMany('App/Models/Atracao')
  }
}

module.exports = Visita
