'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FuncionarioSchema extends Schema {
  up () {
    this.create('funcionarios', (table) => {
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
      table.timestamps();
    })
  }

  down () {
    this.drop('funcionarios')
  }
}

module.exports = FuncionarioSchema
