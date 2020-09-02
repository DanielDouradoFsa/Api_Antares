'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RelatorioSchema extends Schema {
  up () {
    this.create('relatorios', (table) => {
      table.increments('id');
      table.integer('funcionario_id').unsigned()
        .references('id')
        .inTable('funcionarios')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('data_criacao', 255).notNullable();
      table.date('dia_inicio').notNullable();
      table.date('dia_fim').notNullable();
      table.string('relatorio', 255);
    })
  }

  down () {
    this.drop('relatorios')
  }
}

module.exports = RelatorioSchema
