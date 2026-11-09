import { Cliente } from ".Cliente.js";
// Classe responsável por gerenciar os clientes.
export class CadastroClientes {
constructor() {
this.clientes = this.carregar();
}
// Recupera os dados armazenados no navegador.
carregar() {
const dados = JSON.parse(
localStorage.getItem("clientes")
) || [];
// Converte os dados recuperados em objetos da classe Cliente.
return dados.map(item => new Cliente(
item.id,
item.nome,
item.email,
item.telefone,
item.cidade
));
}
// Salva a lista atual no localStorage.
salvarNoNavegador() {
localStorage.setItem(
"clientes",
JSON.stringify(this.clientes)
);
}
// Adiciona um novo cliente.
adicionar(cliente) {
this.clientes.push(cliente);
this.salvarNoNavegador();
}

buscarPorId(id) {
return this.clientes.find(
cliente => cliente.id === id
);
}

atualizar(id, dados) {
const cliente = this.buscarPorId(id);
if (!cliente) {
return false;
}
cliente.atualizar(
dados.nome,
dados.email,
dados.telefone,
dados.cidade
);
this.salvarNoNavegador();
return true;
}


// Remove um cliente da lista.
excluir(id) {
this.clientes = this.clientes.filter(
cliente => cliente.id !== id
);
this.salvarNoNavegador();
}
}