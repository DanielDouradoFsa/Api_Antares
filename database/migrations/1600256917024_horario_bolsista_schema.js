'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HorarioBolsistaSchema extends Schema {
  up () {
    this.create('horario_bolsistas', (table) => {
      table.increments()
      table.integer('bolsista_id').unsigned()
        .references('id')
        .inTable('bolsistas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');


      table.integer('horario_id').unsigned()
        .references('id')
        .inTable('horarios')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
  }

  down () {
    this.drop('horario_bolsistas')
  }
}

module.exports = HorarioBolsistaSchema
