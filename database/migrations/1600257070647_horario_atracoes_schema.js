'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HorarioAtracoesSchema extends Schema {
  up () {
    this.create('horario_atracoes', (table) => {
      table.increments()
      table.integer('atracao_id').unsigned()
        .references('id')
        .inTable('atracoes')
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
    this.drop('horario_atracoes')
  }
}

module.exports = HorarioAtracoesSchema
