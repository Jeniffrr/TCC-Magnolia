import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Bem-vinda ao sistema!</h1>
      <Link to="/login">Ir para Login</Link>
      <br />
      <Link to="/registrar">Ir para Registro</Link>
      <br />
      <Link to="/admin/usuarios">Gerenciar Usuários (Admin)</Link>
    </div>
  );
}