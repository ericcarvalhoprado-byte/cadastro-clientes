export class Cliente {
constructor(id, nome, email, telefone, cidade) {
this.id = id;
this.nome = nome;
this.email = email;
this.telefone = telefone;
this.cidade = cidade;
}
// Atualiza os dados do objeto cliente.
atualizar(nome, email, telefone, cidade) {
this.nome = nome;
this.email = email;
this.telefone = telefone;
this.cidade = cidade;
} }