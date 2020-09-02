### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### Tabelas do Banco de Dados:

USUÁRIO( LOGIN, SENHA, ID)

PESSOA ( ID, NOME, CPF, EMAIL, TELEFONE, ENDEREÇO_ID)

BOLSISTA(ID, PESSOA_ID, USUARIO_ID, ATIVO( 0 INATIVO, 1 ATIVO), MATRICULA, HORARIO_ID)

FUNCIONARIO(ID, USUARIO_ID, PESSOA_ID, ATIVO ( 0 INATIVO, 1 ATIVO), PERMISSOES_ID)

ESCOLA( ID, NOME, TELEFONE, NOME RESPONSÁVEL, TELEFONE RESPONSÁVEL, EMAIL, USUARIO_ID, TIPO(PRIVADA, PUBLICA), ENDEREÇO_ID)

ENDEREÇO( ID, ESTADO, CIDADE, BAIRRO, RUA, N°)

VISITANTE E INDIVIDUO_VISITANTE EXCLUIR

VISITA( ID, DATA, NUMERO_VISITANTES, NOME_RESPONSAVEL, STATUS (AGUARDANDO APROVAÇÃO 1, REALIZADA 2, CANCELADA 3), OBSERVAÇÃO, ATRAÇÕES, HORÁRIO, DATA_SOLICITACAO)

HORARIO( ID, HORARIO_INICIO, HORARIO_FIM, DIA ( 1 a 6 (seg - sab))

ATRAÇÃO( ID, NOME, HORARIO_ID, DIA_INICIO, DIA_FIM, ATIVO( 0 inativo 1 ativo))

PERMISSÕES( ID, GERIR_BOLSISTA, GERIR_FUNCIONARIO, VALIDAR_AGENDAMENTO, GERAR_RELATORIO, INSERIR_ATIVIDADE, GERIR_HORARIO_BOLSISTA, GERIR_BACKUP, VER_ESCOLAS)

RELATÓRIO( ID, FUNCIONARIO_ID, DATA_DE_CRIAÇÃO, DIA_INICIO, DIA_FIM, RELATORIO(BLOB))

### Requisições API

## LOGINS:
	FUNCIONARIO: romaiajr123 roberto
	BOLSISTAS: abc123 123
	ESCOLA: escola1 123

## Tela inicial:
Entrar em CONTATO (Nome, Email, Assunto, Mensagem)

## Tela Login:
Fazer Login 
Esqueci a senha 

## Tela cadastro escola:
Cadastro Escola (Usuário + Escola + Endereço)

## Agendamento Noturno:
Enviar email com tabela
OBS: "individuo visitante" tabela a ser excluida

### <<<<<TELA FUNCIONARIO: (Enviar permissões do usuário na URL da requisição)>>>>>

## Relatorios:
	Carregar Relatórios
	Criar Relatórios
	*Baixar*

## Gerenciar Funcionarios:
	Carregar Funcionários Ativos
	Criar Funcionário (Usuario + Endereço + Funcionario)
	Excluir Funcionário (inativar)

## Gerenciar Bolsistas:
	Carregar Bolsistas Ativos
	Criar Bolsista (Usuario + Endereço + Bolsista)
	Excluir Bolsistas (inativar)

## Escolas:
	Carregar escolas (paginar?)

## Backup:
	Backup BD (criar arquivo BD)

## Visitas:
	Carregar Visita (por status)(3 rotas, uma pra cada status)
	-> cancelar e descancelar visita

## Horario Bolsista:
	Cadastrar Horário
	Editar Horário
	Excluir Horário

## Atividades ("Atrações"):
	Cadastrar Atividades (Atração + Horario)
	Excluir Atividade (inativar)
	Horario das atividades

### <<Bolsistas:>>
	VER HORÁRIO

### <<Escola:>>

## Agendar visita:
	Agendar visita (Horario + Visita + Atração)
	Consultar Horários disponíveis (Bolsistas Trabalhando)

## Meus Agendamentos:
	Carregar agendamentos

## Atualizar Dados (OPCIONAL):
	Confirmação de identidade (A DEFINIR)
	Atualizar Dados (A DEFINIR)






