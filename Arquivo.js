
import { Cliente } from "./Cliente.js";
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

    mensagemVazia.hidden = clientesFiltrados.length > 0;

    clientesFiltrados.forEach(cliente => {
        const linha = document.createElement("tr");

        // Cria as células com os dados do cliente.
        [
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.cidade,
            cliente.cpf
        ].forEach(valor => {
            const celula = document.createElement("td");
            celula.textContent = valor || "-";
            linha.appendChild(celula);
        });

        // Cria a célula que receberá os botões.
        const acoes = document.createElement("td");

        // Botão para editar.
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "editar";
        btnEditar.type = "button";

        btnEditar.addEventListener("click", () => {
            carregarParaEdicao(cliente.id);
        });

        // Botão para excluir.
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.className = "excluir";
        btnExcluir.type = "button";

        btnExcluir.addEventListener("click", () => {
            const confirmou = confirm(
                "Deseja realmente excluir este cliente?"
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
        alert("Cliente não encontrado.");
        return;
    }

    campoId.value = cliente.id;

    document.getElementById("nome").value = cliente.nome;
    document.getElementById("email").value = cliente.email;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("cidade").value = cliente.cidade;
    document.getElementById("cpf").value = cliente.cpf || "";

    botaoSalvar.textContent = "Atualizar cliente";

    document.getElementById("nome").focus();
}

// Evento acionado ao enviar o formulário.
formulario.addEventListener("submit", event => {
    event.preventDefault();

    // Captura os valores digitados pelo usuário.
    const id = campoId.value;

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim().toLowerCase(),
        telefone: document.getElementById("telefone").value.trim(),
        cidade: document.getElementById("cidade").value.trim(),
        cpf: document.getElementById("cpf").value.trim()
    };

    // Validação dos campos obrigatórios.
    if (!dados.nome || !dados.email) {
        alert("Preencha o nome e o e-mail.");
        return;
    }

    // Verifica se o e-mail já pertence a outro cliente.
    const emailDuplicado = cadastro.clientes.some(cliente =>
        cliente.email.trim().toLowerCase() === dados.email &&
        String(cliente.id) !== String(id)
    );

    if (emailDuplicado) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

    // Se existe ID, o sistema atualiza.
    if (id) {
        const atualizou = cadastro.atualizar(id, dados);

        if (!atualizou) {
            alert("Não foi possível atualizar o cliente.");
            return;
        }

        alert("Cliente atualizado com sucesso!");

    } else {
        // Caso contrário, cadastra um novo cliente.
        cadastro.adicionar(
            new Cliente(
                dados.nome,
                dados.email,
                dados.telefone,
                dados.cidade,
                dados.cpf
            )
        );

        alert("Cliente cadastrado com sucesso!");
    }

    // Atualiza a tabela e limpa o formulário.
    renderizarClientes(pesquisa.value);
    limparFormulario();
});

// Evento de pesquisa.
pesquisa.addEventListener("input", () => {
    renderizarClientes(pesquisa.value);
});

// Exibe os clientes ao carregar a página.
renderizarClientes();
