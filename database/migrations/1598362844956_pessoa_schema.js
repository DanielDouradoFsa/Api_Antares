'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PessoaSchema extends Schema {
  up () {
    this.create('pessoas', (table) => {
      table.increments('id');
      table.integer('endereco_id').unsigned()
        .references('id')
        .inTable('enderecos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.string('nome', 255).notNullable();
      table.bigInteger('cpf').notNullable().unique();
      table.string('email', 255).notNullable().unique();
      table.bigInteger('telefone').notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('pessoas')
  }
}

module.exports = PessoaSchema
