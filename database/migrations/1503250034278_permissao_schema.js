'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissaoSchema extends Schema {
  up () {
    this.create('permissoes', (table) => {
      table.increments('id');
      table.boolean('gerir_bolsista').defaultTo(false);
      table.boolean('gerir_funcionario').defaultTo(false);
      table.boolean('agendamento').defaultTo(false);
      table.boolean('relatorio').defaultTo(false);
      table.boolean('cadastrar_atividade').defaultTo(false);
      table.boolean('gerir_horario_bolsista').defaultTo(false);
      table.boolean('gerir_backup').defaultTo(false);
      table.boolean('ver_escolas').defaultTo(false);
      table.boolean('meu_horario').defaultTo(false);
      table.boolean('agendar_visita').defaultTo(false);
      table.boolean('meus_agendamentos').defaultTo(false);
      table.boolean('editar_dados').defaultTo(false);
      table.timestamps();
    })
  }

  down () {
    this.drop('permissoes')
  }
}

module.exports = PermissaoSchema
