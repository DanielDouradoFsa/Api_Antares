'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BolsistaSchema extends Schema {
  up () {
    this.create('bolsistas', (table) => {
      table.increments('id');

      table.integer('pessoa_id').unsigned()
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('user_id').unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('permissao_id').unsigned()
        .references('id')
        .inTable('permissoes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('matricula').notNullable();
      table.boolean('ativo').notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('bolsistas')
  }
}

module.exports = BolsistaSchema
