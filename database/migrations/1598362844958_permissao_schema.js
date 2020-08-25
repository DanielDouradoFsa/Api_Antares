'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissaoSchema extends Schema {
  up () {
    this.create('permissoes', (table) => {
      table.increments('id');
      table.boolean('gerir_bolsita').defaultTo(0).notNullable();
      table.boolean('gerir_funcionario').defaultTo(0).notNullable();
      table.boolean('validar_agendamento').defaultTo(0).notNullable();
      table.boolean('gerar_relatorio').defaultTo(0).notNullable();
      table.boolean('inserir_atividade').defaultTo(0).notNullable();
      table.boolean('gerir_horario_bolsista').defaultTo(0).notNullable();
      table.boolean('gerir_backup').defaultTo(0).notNullable();
      table.boolean('ver_escolas').defaultTo(0).notNullable();
    })
  }

  down () {
    this.drop('permissoes')
  }
}

module.exports = PermissaoSchema
