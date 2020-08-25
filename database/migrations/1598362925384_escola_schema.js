'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EscolaSchema extends Schema {
  up () {
    this.create('escolas', (table) => {
      table.increments('id');
      table.string('nome', 255).notNullable();
      table.integer('telefone').notNullable();
      table.string('nome_responsavel', 255).notNullable();
      table.integer('telefone_responsavel').notNullable();
      table.string('email', 255).notNullable();
      table.string('tipo', 20).notNullable();

      table.integer('usuario_id').unsigned()
        .references('id')
        .inTable('usuarios')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.integer('endereco_id').unsigned()
        .references('id')
        .inTable('enderecos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
  }

  down () {
    this.drop('escolas')
  }
}

module.exports = EscolaSchema
