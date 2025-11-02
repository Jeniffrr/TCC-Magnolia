import React from "react";
import AppLayout from "../../components/Layout/AppLayout";
import { Container } from "@govbr-ds/react-components";
import { pageStyles } from "../Resgister/components/Register.styles";

const ProfissionaisHome: React.FC = () => {
  return (
    <>
      <AppLayout>
        <Container fluid>
          <h1 style={pageStyles.title}>
            Bem vindo ao painel do profissional
          </h1>
          <div style={pageStyles.containerPadding}> </div>
        </Container>
      </AppLayout>
    </>
  );
};

export default ProfissionaisHome;
