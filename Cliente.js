export class Cliente {

 
    constructor(nome, email, telefone, cidade, cpf) {
        this.id = Date.now().toString();
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cidade = cidade;
        this.cpf = cpf;
    }

// Atualiza os dados do objeto cliente.
atualizar(nome, email, telefone, cidade) {
this.nome = nome;
this.email = email;
this.telefone = telefone;
this.cidade = cidade;
} 
 
    
}





