import PublicLayout from "../components/Layout/PublicLayout";
import { pageStyles } from "../assets/style/pageStyles";
import { Container } from "@govbr-ds/react-components";
import "./LegalPages.css";

export default function Privacidade() {
  return (
    <PublicLayout>
      <Container fluid>
        <div className="legal-page-container">
          <h1 className="legal-page-title" style={pageStyles.title}>Política de Privacidade</h1>
        
        <div className="legal-page-card">
          <p className="legal-page-date">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>

          <h2 className="legal-page-section-title">1. Controlador e Encarregado de Dados</h2>
          <p className="legal-page-text">
            <strong>Controlador:</strong> Magnolia - Sistema de Apoio Clínico<br/>
            <strong>Encarregado (DPO):</strong> dpo@magnolia.com.br<br/>
            Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e a Lei de Acesso à Informação (LAI - Lei nº 12.527/2011).
          </p>

          <h2 className="legal-page-section-title">2. Base Legal para Tratamento de Dados</h2>
          <p className="legal-page-text">O tratamento de dados pessoais no Magnolia é realizado com base nas seguintes hipóteses legais previstas no Art. 7º da LGPD:</p>
          <ul className="legal-page-list">
            <li><strong>Consentimento:</strong> mediante autorização expressa do titular para finalidades específicas</li>
            <li><strong>Execução de contrato:</strong> para prestação de serviços de apoio clínico</li>
            <li><strong>Exercício regular de direitos:</strong> em processos judiciais, administrativos ou arbitrais</li>
            <li><strong>Proteção da vida:</strong> para tutela da saúde em procedimentos realizados por profissionais de saúde</li>
            <li><strong>Cumprimento de obrigação legal:</strong> quando exigido por lei ou regulamentação</li>
          </ul>
          <p className="legal-page-text">
            Para dados sensíveis de saúde (Art. 11 da LGPD), o tratamento é realizado exclusivamente para fins de prestação de serviços de saúde, garantindo a prevenção e o diagnóstico, quando os dados forem fornecidos pelo próprio titular ou com seu consentimento específico.
          </p>

          <h2 className="legal-page-section-title">3. Dados Pessoais Coletados</h2>
          <p className="legal-page-text"><strong>3.1. Dados Cadastrais de Profissionais:</strong></p>
          <ul className="legal-page-list">
            <li>Nome completo, CPF, e-mail, telefone</li>
            <li>Registro profissional (CRM, COREN, etc.)</li>
            <li>Especialidade e área de atuação</li>
            <li>Data de consentimento LGPD</li>
          </ul>
          <p className="legal-page-text"><strong>3.2. Dados Institucionais:</strong></p>
          <ul className="legal-page-list">
            <li>Nome do hospital, CNPJ, CNES</li>
            <li>Endereço completo da instituição</li>
          </ul>
          <p className="legal-page-text"><strong>3.3. Dados Sensíveis de Pacientes (Art. 5º, II da LGPD):</strong></p>
          <ul className="legal-page-list">
            <li>Dados de identificação: nome, CPF, data de nascimento</li>
            <li>Dados de saúde: sinais vitais, sintomas, diagnósticos, medicações</li>
            <li>Histórico clínico e atendimentos</li>
            <li>Classificação de risco e desfechos clínicos</li>
          </ul>
          <p className="legal-page-text"><strong>3.4. Dados de Navegação:</strong></p>
          <ul className="legal-page-list">
            <li>Endereço IP, logs de acesso</li>
            <li>Data, hora e duração de acesso</li>
            <li>Ações realizadas no sistema</li>
          </ul>

          <h2 className="legal-page-section-title">4. Finalidades do Tratamento</h2>
          <p className="legal-page-text">Os dados pessoais são tratados para as seguintes finalidades específicas:</p>
          <ul className="legal-page-list">
            <li>Prestação de serviços de apoio à decisão clínica</li>
            <li>Gestão de prontuários eletrônicos e histórico de atendimentos</li>
            <li>Classificação automática de risco de pacientes</li>
            <li>Geração de relatórios e estatísticas para gestão hospitalar</li>
            <li>Comunicação com profissionais de saúde</li>
            <li>Auditoria e rastreabilidade de ações no sistema</li>
            <li>Cumprimento de obrigações legais e regulatórias</li>
            <li>Defesa de direitos em processos judiciais ou administrativos</li>
            <li>Melhoria contínua do sistema e desenvolvimento de novas funcionalidades</li>
          </ul>

          <h2 className="legal-page-section-title">5. Compartilhamento de Dados</h2>
          <p className="legal-page-text">Os dados pessoais não são comercializados ou compartilhados com terceiros, exceto nas seguintes situações:</p>
          <ul className="legal-page-list">
            <li>Com autorização expressa do titular</li>
            <li>Para cumprimento de obrigação legal ou regulatória</li>
            <li>Por determinação judicial ou de autoridade competente</li>
            <li>Para proteção da vida ou da incolumidade física do titular ou de terceiros</li>
            <li>Com profissionais de saúde envolvidos no atendimento do paciente</li>
          </ul>
          <p className="legal-page-text">
            Quando houver compartilhamento, serão adotadas medidas para garantir a segurança e confidencialidade dos dados, mediante contratos que assegurem o cumprimento da LGPD.
          </p>

          <h2 className="legal-page-section-title">6. Segurança e Proteção de Dados</h2>
          <p className="legal-page-text">Implementamos medidas técnicas e organizacionais de segurança, conforme Art. 46 da LGPD:</p>
          <ul className="legal-page-list">
            <li><strong>Criptografia:</strong> dados sensíveis são criptografados em trânsito e em repouso</li>
            <li><strong>Controle de acesso:</strong> autenticação obrigatória e controle de permissões por perfil</li>
            <li><strong>Auditoria:</strong> registro de todas as ações realizadas no sistema</li>
            <li><strong>Backup:</strong> cópias de segurança regulares dos dados</li>
            <li><strong>Monitoramento:</strong> detecção de acessos não autorizados e atividades suspeitas</li>
            <li><strong>Treinamento:</strong> capacitação contínua da equipe sobre proteção de dados</li>
            <li><strong>Política de senhas:</strong> requisitos mínimos de complexidade e renovação periódica</li>
          </ul>
          <p className="legal-page-text">
            Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados serão comunicados em prazo razoável, conforme Art. 48 da LGPD.
          </p>

          <h2 className="legal-page-section-title">7. Retenção e Eliminação de Dados</h2>
          <p className="legal-page-text">Os dados pessoais são mantidos pelo período necessário para:</p>
          <ul className="legal-page-list">
            <li>Cumprimento das finalidades para as quais foram coletados</li>
            <li>Atendimento de obrigações legais (ex: prontuários médicos devem ser mantidos por no mínimo 20 anos, conforme Resolução CFM nº 1.821/2007)</li>
            <li>Exercício regular de direitos em processos judiciais ou administrativos</li>
          </ul>
          <p className="legal-page-text">
            Após o término do período de retenção, os dados serão eliminados de forma segura ou anonimizados, salvo se houver obrigação legal de manutenção.
          </p>

          <h2 className="legal-page-section-title">8. Direitos dos Titulares (Art. 18 da LGPD)</h2>
          <p className="legal-page-text">Você tem os seguintes direitos garantidos pela LGPD:</p>
          <ul className="legal-page-list">
            <li><strong>Confirmação e acesso:</strong> confirmar a existência de tratamento e acessar seus dados</li>
            <li><strong>Correção:</strong> solicitar correção de dados incompletos, inexatos ou desatualizados</li>
            <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários, excessivos ou tratados em desconformidade</li>
            <li><strong>Portabilidade:</strong> solicitar a portabilidade dos dados a outro fornecedor de serviço</li>
            <li><strong>Eliminação:</strong> dos dados tratados com base no consentimento</li>
            <li><strong>Informação:</strong> sobre entidades públicas e privadas com as quais compartilhamos dados</li>
            <li><strong>Informação sobre consentimento:</strong> possibilidade de não fornecer consentimento e consequências da negativa</li>
            <li><strong>Revogação do consentimento:</strong> a qualquer momento, mediante manifestação expressa</li>
            <li><strong>Oposição:</strong> ao tratamento realizado com dispensa de consentimento</li>
            <li><strong>Revisão:</strong> de decisões automatizadas que afetem seus interesses</li>
          </ul>
          <p className="legal-page-text">
            Para exercer seus direitos, entre em contato através dos canais indicados na seção 10.
          </p>

          <h2 className="legal-page-section-title">9. Transferência Internacional de Dados</h2>
          <p className="legal-page-text">
            Atualmente, os dados são armazenados e processados exclusivamente em território nacional. Caso haja necessidade de transferência internacional, será realizada apenas para países ou organismos internacionais que proporcionem grau de proteção adequado, conforme Art. 33 da LGPD, e mediante consentimento específico do titular.
          </p>

          <h2 className="legal-page-section-title">10. Canais de Atendimento</h2>
          <p className="legal-page-text">
            <strong>Encarregado de Proteção de Dados (DPO):</strong><br/>
            E-mail: dpo@magnolia.com.br<br/>
            Prazo de resposta: até 15 dias úteis
          </p>
          <p className="legal-page-text">
            <strong>Contato Geral:</strong><br/>
            E-mail: contato@magnolia.com.br<br/>
            Telefone: (11) 0000-0000
          </p>
          <p className="legal-page-text">
            <strong>Autoridade Nacional de Proteção de Dados (ANPD):</strong><br/>
            Caso não obtenha resposta satisfatória, você pode contatar a ANPD através do site: <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="legal-page-link">www.gov.br/anpd</a>
          </p>

          <h2 className="legal-page-section-title">11. Alterações nesta Política</h2>
          <p className="legal-page-text">
            Esta Política de Privacidade pode ser atualizada periodicamente. Alterações significativas serão comunicadas através do sistema e por e-mail. Recomendamos a leitura periódica deste documento.
          </p>

          <h2 className="legal-page-section-title">12. Legislação Aplicável</h2>
          <p className="legal-page-text">
            Esta Política de Privacidade é regida pela legislação brasileira, especialmente:
          </p>
          <ul className="legal-page-list">
            <li>Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD)</li>
            <li>Lei nº 12.965/2014 (Marco Civil da Internet)</li>
            <li>Lei nº 12.527/2011 (Lei de Acesso à Informação)</li>
            <li>Código de Ética Médica (Resolução CFM nº 2.217/2018)</li>
            <li>Resolução CFM nº 1.821/2007 (Prontuário Médico)</li>
          </ul>
        </div>
        </div>
      </Container>
    </PublicLayout>
  );
}
