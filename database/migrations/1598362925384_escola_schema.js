'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EscolaSchema extends Schema {
  up () {
    this.create('escolas', (table) => {
      table.increments('id');
      table.integer('user_id').unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('endereco_id').unsigned()
        .references('id')
        .inTable('enderecos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('nome', 255).notNullable();
      table.string('cnpj', 14).notNullable();
      table.integer('telefone').notNullable();
      table.string('nome_responsavel', 255).notNullable();
      table.integer('telefone_responsavel').notNullable();
      table.string('email', 255).notNullable();
      table.string('tipo', 20).notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('escolas')
  }
}

module.exports = EscolaSchema
