'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BolsistaSchema extends Schema {
  up () {
    this.create('bolsistas', (table) => {
      table.increments('id');
      table.integer('matricula').notNullable();
      table.boolean('ativo').notNullable();

      table.integer('pessoa_id').unsigned()
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('usuario_id').unsigned()
        .references('id')
        .inTable('usuarios')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('permissao_id').unsigned()
        .references('id')
        .inTable('permissoes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
  }

  down () {
    this.drop('bolsistas')
  }
}

module.exports = BolsistaSchema
