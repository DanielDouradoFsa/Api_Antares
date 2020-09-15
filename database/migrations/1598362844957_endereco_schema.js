'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnderecoSchema extends Schema {
  up () {
    this.create('enderecos', (table) => {
      table.increments('id');
      table.integer('pessoa_id').unsigned()
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.string('estado', 22).notNullable();
      table.string('cidade', 120).notNullable();
      table.string('bairro', 120).notNullable();
      table.string('rua', 255).notNullable();
      table.integer('numero').notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('enderecos')
  }
}

module.exports = EnderecoSchema
