import AppLayout from "../../components/Layout/AppLayout";
import { Container } from "@govbr-ds/react-components";
import { pageStyles } from "../../assets/style/pageStyles";

export default function Home() {
  return (
    <>
      <AppLayout>
        <Container fluid>
          <h1 style={pageStyles.title}>
            Bem vindo a ferramenta administrativa
          </h1>
          <div style={pageStyles.containerPadding}></div>
        </Container>
      </AppLayout>
    </>
  );
}
