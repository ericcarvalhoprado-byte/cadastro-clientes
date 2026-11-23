import { Cliente } from "./Cliente.js";

// Classe responsável por gerenciar e armazenar os clientes.
export class CadastroClientes {
    constructor() {
        this.clientes = this.carregar();
    }

    // Recupera os dados salvos no navegador.
    carregar() {
        try {
            const dados = JSON.parse(localStorage.getItem("clientes")) || [];
            if (!Array.isArray(dados)) return [];

            // Recria cada objeto Cliente mantendo o ID original.
            return dados.map(item => new Cliente(
                item.nome || "",
                item.email || "",
                item.telefone || "",
                item.cidade || "",
                item.cpf || "",
                item.id || null
            ));
        } catch (erro) {
            console.error("Não foi possível carregar os clientes:", erro);
            return [];
        }
    }

    // Salva a lista atual no armazenamento do navegador.
    salvarNoNavegador() {
        localStorage.setItem("clientes", JSON.stringify(this.clientes));
    }

    adicionar(cliente) {
        this.clientes.push(cliente);
        this.salvarNoNavegador();
    }

    buscarPorId(id) {
        return this.clientes.find(cliente => String(cliente.id) === String(id));
    }

    atualizar(id, dados) {
        const cliente = this.buscarPorId(id);
        if (!cliente) return false;

        cliente.atualizar(
            dados.nome,
            dados.email,
            dados.telefone,
            dados.cidade,
            dados.cpf
        );

        this.salvarNoNavegador();
        return true;
    }

    excluir(id) {
        const quantidadeAntes = this.clientes.length;
        this.clientes = this.clientes.filter(
            cliente => String(cliente.id) !== String(id)
        );

        if (this.clientes.length !== quantidadeAntes) {
            this.salvarNoNavegador();
            return true;
        }
        return false;
    }
}
