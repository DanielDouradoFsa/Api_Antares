'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HorarioSchema extends Schema {
  up () {
    this.create('horarios', (table) => {
      table.increments('id');
      table.integer('dia', 1).notNullable();
      table.date('horario_inicio').notNullable();
      table.date('horario_fim').notNullable();
    })
  }

  down () {
    this.drop('horarios')
  }
}

module.exports = HorarioSchema
