// Representa um cliente cadastrado no sistema.
export class Cliente {
    constructor(nome, email, telefone = "", cidade = "", cpf = "", id = null) {
        this.id = id || (globalThis.crypto?.randomUUID
            ? globalThis.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cidade = cidade;
        this.cpf = cpf;
    }

    // Atualiza todos os dados editáveis do cliente.
    atualizar(nome, email, telefone, cidade, cpf) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cidade = cidade;
        this.cpf = cpf;
    }
}
