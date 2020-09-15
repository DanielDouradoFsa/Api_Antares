'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HorarioSchema extends Schema {
  up () {
    this.create('horarios', (table) => {
      table.increments('id');

      table.integer('bolsista_id').unsigned()
        .references('id')
        .inTable('bolsistas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('dia', 1).notNullable();
      table.string('horario_inicio', 255).notNullable();
      table.string('horario_fim', 255).notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('horarios')
  }
}

module.exports = HorarioSchema
