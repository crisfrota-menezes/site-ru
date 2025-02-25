export default class Usuario {
  constructor(tipo, ra) {
    this.tipo = tipo;
    this.ra = ra; // Adiciona o RA ao usuário
  }

  temDesconto() {
    return this.tipo === "estudante";
  }

  static validarLogin(users, ra, senha) {
    const user = users.find((u) => u.ra === ra && u.senha === senha);
    if (user) {
      return new Usuario(user.tipo, user.ra); // Retorna uma instância de Usuario
    }
    return null; // Retorna null se as credenciais forem inválidas
  }
}
