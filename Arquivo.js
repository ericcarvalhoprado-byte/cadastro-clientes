import { Cliente } from &quot;./Cliente.js&quot;;
import { CadastroClientes } from "./CadastroClientes.js";
// Cria o objeto responsável pelo gerenciamento dos clientes.
const cadastro = new CadastroClientes();

// Captura os elementos HTML que serão utilizados.
const formulario = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");
const pesquisa = document.getElementById("pesquisa");
const mensagemVazia = document.getElementById("mensagemVazia");
const campoId = document.getElementById("clienteId");
const botaoSalvar = document.getElementById("btnSalvar");


// Limpa os campos do formulário.
function limparFormulario() {
formulario.reset();
campoId.value = "";
botaoSalvar.textContent = "Salvar cliente";
}
// Mostra os clientes cadastrados na tabela.
function renderizarClientes(filtro = "") {
lista.innerHTML = "";
const termo = filtro.toLowerCase().trim();

// Filtra pelo nome ou pelo e-mail.
const clientesFiltrados = cadastro.clientes.filter(cliente =>
cliente.nome.toLowerCase().includes(termo) ||
cliente.email.toLowerCase().includes(termo)
);
mensagemVazia.hidden = clientesFiltrados.length &gt; 0;
clientesFiltrados.forEach(cliente => {
const linha = document.createElement("tr");

// Cria as células com os dados do cliente.
[cliente.nome, cliente.email, cliente.telefone, cliente.cidade]
.forEach(valor => {
const celula = document.createElement("td");
celula.textContent = valor || "-";
linha.appendChild(celula);
});
// Cria a célula que receberá os botões.
const acoes = document.createElement(&quot;td&quot;);

// Botão para editar.
const btnEditar = document.createElement(&quot;button&quot;);
btnEditar.textContent = "Editar";
btnEditar.className = "editar";
btnEditar.type = "button";


btnEditar.addEventListener("click" () => {
carregarParaEdicao(cliente.id);
});
// Botão para excluir.
const btnExcluir = document.createElement(&quot;button&quot;);
btnExcluir.textContent = &quot;Excluir&quot;;
btnExcluir.className = &quot;excluir&quot;;
btnExcluir.type = &quot;button&quot;;
btnExcluir.addEventListener(&quot;click&quot;, () =&gt; {
const confirmou = confirm(
&quot;Deseja realmente excluir este cliente?&quot;
);
if (confirmou) {
cadastro.excluir(cliente.id);
renderizarClientes(pesquisa.value);
limparFormulario();
}
});
acoes.append(btnEditar, btnExcluir);
linha.appendChild(acoes);
lista.appendChild(linha);
});
}
// Preenche o formulário com os dados do cliente selecionado.
function carregarParaEdicao(id) {
const cliente = cadastro.buscarPorId(id);
if (!cliente) {
alert(&quot;Cliente não encontrado.&quot;);
return;
}
campoId.value = cliente.id;
document.getElementById(&quot;nome&quot;).value = cliente.nome;
document.getElementById(&quot;email&quot;).value = cliente.email;
document.getElementById(&quot;telefone&quot;).value = cliente.telefone;
document.getElementById(&quot;cidade&quot;).value = cliente.cidade;
botaoSalvar.textContent = &quot;Atualizar cliente&quot;;
document.getElementById(&quot;nome&quot;).focus();
}
// Evento acionado ao enviar o formulário.
formulario.addEventListener(&quot;submit&quot;, event =&gt; {
event.preventDefault();
// Captura os valores digitados pelo usuário.
const id = campoId.value;
const dados = {
nome: document.getElementById(&quot;nome&quot;).value.trim(),
email: document.getElementById(&quot;email&quot;).value.trim(),
telefone: document.getElementById(&quot;telefone&quot;).value.trim(),
cidade: document.getElementById(&quot;cidade&quot;).value.trim()
};
// Validação dos campos obrigatórios.
if (!dados.nome || !dados.email) {
alert(&quot;Preencha o nome e o e-mail.&quot;);
return;
}
// Se existe ID, o sistema atualiza; caso contrário, cadastra.
if (id) {
const atualizou = cadastro.atualizar(id, dados);