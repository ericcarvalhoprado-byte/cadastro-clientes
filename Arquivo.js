import { Cliente } from "./Cliente.js";
import { CadastroClientes } from "./CadastroClientes.js";

// Instancia a classe que gerencia os registros.
const cadastro = new CadastroClientes();

// Captura os elementos da página.
const formulario = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");
const pesquisa = document.getElementById("pesquisa");
const mensagemVazia = document.getElementById("mensagemVazia");
const mensagemPesquisa = document.getElementById("mensagemPesquisa");
const campoId = document.getElementById("clienteId");
const botaoSalvar = document.getElementById("btnSalvar");
const botaoCancelar = document.getElementById("btnCancelar");

const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    telefone: document.getElementById("telefone"),
    cidade: document.getElementById("cidade"),
    cpf: document.getElementById("cpf")
};

// Limpa o formulário e encerra o modo de edição.
function limparFormulario() {
    formulario.reset();
    campoId.value = "";
    botaoSalvar.textContent = "Salvar cliente";
    botaoCancelar.hidden = true;
}

// Cria uma célula de tabela usando textContent para evitar inserir HTML digitado.
function criarCelula(valor) {
    const celula = document.createElement("td");
    celula.textContent = valor || "-";
    return celula;
}

// Exibe os clientes na tabela, aplicando o filtro de pesquisa.
function renderizarClientes(filtro = "") {
    lista.innerHTML = "";

    const termo = filtro.trim().toLocaleLowerCase("pt-BR");
    const todos = cadastro.clientes;
    const clientesFiltrados = todos.filter(cliente =>
        cliente.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
        cliente.email.toLocaleLowerCase("pt-BR").includes(termo)
    );

    mensagemVazia.hidden = todos.length !== 0;
    mensagemPesquisa.hidden = todos.length === 0 || clientesFiltrados.length !== 0;

    clientesFiltrados.forEach(cliente => {
        const linha = document.createElement("tr");

        linha.append(
            criarCelula(cliente.nome),
            criarCelula(cliente.email),
            criarCelula(cliente.telefone),
            criarCelula(cliente.cidade),
            criarCelula(cliente.cpf)
        );

        const celulaAcoes = document.createElement("td");
        celulaAcoes.className = "acoes-tabela";

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "botao-tabela editar";
        botaoEditar.addEventListener("click", () => carregarParaEdicao(cliente.id));

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "botao-tabela excluir";
        botaoExcluir.addEventListener("click", () => {
            if (confirm(`Deseja realmente excluir o cadastro de ${cliente.nome}?`)) {
                cadastro.excluir(cliente.id);
                if (String(campoId.value) === String(cliente.id)) limparFormulario();
                renderizarClientes(pesquisa.value);
            }
        });

        celulaAcoes.append(botaoEditar, botaoExcluir);
        linha.appendChild(celulaAcoes);
        lista.appendChild(linha);
    });
}

// Preenche o formulário com os dados do cliente escolhido.
function carregarParaEdicao(id) {
    const cliente = cadastro.buscarPorId(id);

    if (!cliente) {
        alert("Cliente não encontrado.");
        return;
    }

    campoId.value = cliente.id;
    campos.nome.value = cliente.nome;
    campos.email.value = cliente.email;
    campos.telefone.value = cliente.telefone;
    campos.cidade.value = cliente.cidade;
    campos.cpf.value = cliente.cpf || "";

    botaoSalvar.textContent = "Atualizar cliente";
    botaoCancelar.hidden = false;
    campos.nome.focus();
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Salva um novo cliente ou atualiza um registro existente.
formulario.addEventListener("submit", event => {
    event.preventDefault();

    const id = campoId.value;
    const dados = {
        nome: campos.nome.value.trim(),
        email: campos.email.value.trim().toLowerCase(),
        telefone: campos.telefone.value.trim(),
        cidade: campos.cidade.value.trim(),
        cpf: campos.cpf.value.trim()
    };

    if (!dados.nome || !dados.email) {
        alert("Preencha o nome e o e-mail.");
        return;
    }

    const emailDuplicado = cadastro.clientes.some(cliente =>
        cliente.email.trim().toLowerCase() === dados.email &&
        String(cliente.id) !== String(id)
    );

    if (emailDuplicado) {
        alert("Este e-mail já está cadastrado para outro cliente.");
        campos.email.focus();
        return;
    }

    try {
        if (id) {
            const atualizou = cadastro.atualizar(id, dados);
            if (!atualizou) {
                alert("Não foi possível atualizar o cliente. Tente novamente.");
                return;
            }
            alert("Cliente atualizado com sucesso!");
        } else {
            cadastro.adicionar(new Cliente(
                dados.nome,
                dados.email,
                dados.telefone,
                dados.cidade,
                dados.cpf
            ));
            alert("Cliente cadastrado com sucesso!");
        }

        renderizarClientes(pesquisa.value);
        limparFormulario();
    } catch (erro) {
        console.error("Erro ao salvar cliente:", erro);
        alert("Não foi possível salvar os dados neste navegador.");
    }
});

// Pesquisa enquanto o usuário digita.
pesquisa.addEventListener("input", () => renderizarClientes(pesquisa.value));

// Cancela uma edição em andamento.
botaoCancelar.addEventListener("click", limparFormulario);

// Renderiza os dados já salvos ao abrir a página.
renderizarClientes();
