import { Link } from "react-router-dom";
import AppLayout from "../../components/Layout/AppLayout";
import { Container } from "@govbr-ds/react-components";
import { pageStyles } from "../Resgister/Register.styles";

export default function Home() {
  return (
    <>
    <AppLayout>
      <Container fluid>
        
      <h1 style={pageStyles.title}>Bem vindo a ferramenta administrativa</h1>

      <div style={pageStyles.containerPadding} >
       
      </div>
    </Container>
    </AppLayout>
    </>
  );
}
