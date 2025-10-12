import { Link } from "react-router-dom";
import PublicLayout from "../components/Layout/PublicLayout";

export default function Home() {
  return (
    <PublicLayout showLoginButton={true}>
      <div>
        <h1>Bem-vinda ao sistema!</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <Link to="/login">Ir para Login</Link>
          <Link to="/registrar">Ir para Registro</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
