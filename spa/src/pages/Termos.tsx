import PublicLayout from "../components/Layout/PublicLayout";
import { pageStyles } from "../assets/style/pageStyles";
import { Container } from "@govbr-ds/react-components";
import "./LegalPages.css";

export default function Termos() {
  return (
    <PublicLayout>
      <Container fluid>
        <div className="legal-page-container">
          <h1 className="legal-page-title" style={pageStyles.title}>Termos de Uso</h1>
        
        <div className="legal-page-card">
          <p className="legal-page-date">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>

          <h2 className="legal-page-section-title">1. Aceitação dos Termos</h2>
          <p className="legal-page-text">
            Ao acessar e utilizar o sistema Magnolia, você declara ter lido, compreendido e concordado com estes Termos de Uso e com a Política de Privacidade. Se não concordar com qualquer disposição, não utilize o sistema.
          </p>
          <p className="legal-page-text">
            Estes termos constituem um contrato juridicamente vinculante entre você (usuário) e o Magnolia (controlador de dados).
          </p>

          <h2 className="legal-page-section-title">2. Definições</h2>
          <ul className="legal-page-list">
            <li><strong>Sistema:</strong> plataforma Magnolia de apoio clínico</li>
            <li><strong>Usuário:</strong> profissional de saúde ou administrador cadastrado</li>
            <li><strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais (paciente)</li>
            <li><strong>Dados Pessoais:</strong> informação relacionada a pessoa natural identificada ou identificável</li>
            <li><strong>Dados Sensíveis:</strong> dados pessoais sobre saúde, conforme Art. 5º, II da LGPD</li>
          </ul>

          <h2 className="legal-page-section-title">3. Descrição do Serviço</h2>
          <p className="legal-page-text">
            O Magnolia é um sistema de apoio à decisão clínica destinado exclusivamente a profissionais de saúde e instituições hospitalares, oferecendo:
          </p>
          <ul className="legal-page-list">
            <li>Gestão de prontuários eletrônicos</li>
            <li>Registro de atendimentos e histórico clínico</li>
            <li>Classificação automática de risco de pacientes</li>
            <li>Controle de leitos e internações</li>
            <li>Relatórios e estatísticas gerenciais</li>
            <li>Auditoria e rastreabilidade de ações</li>
          </ul>
          <p className="legal-page-warning">
            <strong>IMPORTANTE:</strong> O sistema é uma ferramenta de apoio e não substitui o julgamento clínico do profissional de saúde. Todas as decisões médicas são de responsabilidade exclusiva do profissional habilitado.
          </p>

          <h2 className="legal-page-section-title">4. Elegibilidade e Cadastro</h2>
          <p className="legal-page-text"><strong>4.1. Requisitos:</strong></p>
          <ul className="legal-page-list">
            <li>Ser profissional de saúde com registro ativo em conselho de classe (CRM, COREN, etc.)</li>
            <li>Estar vinculado a instituição hospitalar regularizada (CNPJ e CNES válidos)</li>
            <li>Ter capacidade legal para celebrar contratos</li>
            <li>Fornecer consentimento expresso para tratamento de dados pessoais (LGPD)</li>
          </ul>
          <p className="legal-page-text"><strong>4.2. Obrigações no Cadastro:</strong></p>
          <ul className="legal-page-list">
            <li>Fornecer informações verdadeiras, completas e atualizadas</li>
            <li>Manter dados cadastrais atualizados</li>
            <li>Não criar contas falsas ou usar identidade de terceiros</li>
            <li>Não criar múltiplas contas para o mesmo usuário</li>
          </ul>
          <p className="legal-page-text"><strong>4.3. Segurança da Conta:</strong></p>
          <ul className="legal-page-list">
            <li>Manter sigilo absoluto de suas credenciais de acesso (usuário e senha)</li>
            <li>Não compartilhar sua conta com terceiros</li>
            <li>Utilizar senha forte (mínimo 8 caracteres)</li>
            <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
            <li>Fazer logout ao final de cada sessão, especialmente em computadores compartilhados</li>
          </ul>
          <p className="legal-page-text">
            Você é integralmente responsável por todas as atividades realizadas em sua conta.
          </p>

          <h2 className="legal-page-section-title">5. Uso Adequado e Proibições</h2>
          <p className="legal-page-text"><strong>5.1. Uso Permitido:</strong></p>
          <ul className="legal-page-list">
            <li>Utilizar o sistema exclusivamente para fins profissionais legítimos</li>
            <li>Registrar informações clínicas verdadeiras e precisas</li>
            <li>Respeitar o sigilo médico e confidencialidade dos dados</li>
            <li>Cumprir o Código de Ética Médica e normas do conselho de classe</li>
          </ul>
          <p className="legal-page-text"><strong>5.2. Condutas Proibidas:</strong></p>
          <ul className="legal-page-list">
            <li>Acessar dados de pacientes sem justificativa clínica</li>
            <li>Compartilhar informações de pacientes fora do contexto profissional</li>
            <li>Inserir dados falsos, imprecisos ou enganosos</li>
            <li>Tentar acessar áreas restritas ou contas de outros usuários</li>
            <li>Realizar engenharia reversa, descompilação ou desmontagem do sistema</li>
            <li>Utilizar scripts, bots ou ferramentas automatizadas não autorizadas</li>
            <li>Sobrecarregar a infraestrutura do sistema</li>
            <li>Violar direitos de propriedade intelectual</li>
            <li>Utilizar o sistema para fins ilegais ou não autorizados</li>
            <li>Transmitir vírus, malware ou códigos maliciosos</li>
          </ul>

          <h2 className="legal-page-section-title">6. Responsabilidades e Limitações</h2>
          <p className="legal-page-text"><strong>6.1. Responsabilidades do Usuário:</strong></p>
          <ul className="legal-page-list">
            <li>Veracidade e exatidão das informações inseridas</li>
            <li>Decisões clínicas e condutas terapêuticas adotadas</li>
            <li>Cumprimento de normas éticas e legais da profissão</li>
            <li>Proteção da confidencialidade dos dados de pacientes</li>
            <li>Uso adequado e seguro do sistema</li>
          </ul>
          <p className="legal-page-text"><strong>6.2. Responsabilidades do Magnolia:</strong></p>
          <ul className="legal-page-list">
            <li>Manter a segurança e integridade dos dados</li>
            <li>Garantir disponibilidade do sistema (exceto em manutenções programadas)</li>
            <li>Cumprir a legislação de proteção de dados (LGPD)</li>
            <li>Fornecer suporte técnico adequado</li>
          </ul>
          <p className="legal-page-text"><strong>6.3. Limitações de Responsabilidade:</strong></p>
          <p className="legal-page-text">
            O Magnolia não se responsabiliza por:
          </p>
          <ul className="legal-page-list">
            <li>Decisões clínicas tomadas pelos profissionais de saúde</li>
            <li>Erros ou imprecisões nas informações inseridas pelos usuários</li>
            <li>Danos decorrentes de uso inadequado do sistema</li>
            <li>Interrupções causadas por força maior ou caso fortuito</li>
            <li>Falhas de conexão de internet do usuário</li>
            <li>Violações de segurança causadas por negligência do usuário</li>
          </ul>

          <h2 className="legal-page-section-title">7. Propriedade Intelectual</h2>
          <p className="legal-page-text">
            Todo o conteúdo do sistema, incluindo mas não se limitando a código-fonte, design, interface, textos, gráficos, logotipos, ícones e algoritmos, é de propriedade exclusiva do Magnolia e protegido por:
          </p>
          <ul className="legal-page-list">
            <li>Lei de Direitos Autorais (Lei nº 9.610/1998)</li>
            <li>Lei de Propriedade Industrial (Lei nº 9.279/1996)</li>
            <li>Lei de Software (Lei nº 9.609/1998)</li>
          </ul>
          <p className="legal-page-text">
            É proibida a reprodução, distribuição, modificação ou uso comercial sem autorização expressa.
          </p>

          <h2 className="legal-page-section-title">8. Proteção de Dados Pessoais (LGPD)</h2>
          <p className="legal-page-text">
            O tratamento de dados pessoais no sistema está em conformidade com a Lei nº 13.709/2018 (LGPD). Para informações detalhadas, consulte nossa <a href="/privacidade" className="legal-page-link">Política de Privacidade</a>.
          </p>
          <p className="legal-page-text"><strong>Compromissos:</strong></p>
          <ul className="legal-page-list">
            <li>Tratamento de dados apenas para finalidades legítimas e específicas</li>
            <li>Implementação de medidas de segurança técnicas e organizacionais</li>
            <li>Respeito aos direitos dos titulares de dados</li>
            <li>Transparência no tratamento de dados</li>
            <li>Notificação de incidentes de segurança</li>
          </ul>

          <h2 className="legal-page-section-title">9. Disponibilidade e Manutenção</h2>
          <p className="legal-page-text">
            Embora nos esforcemos para manter o sistema disponível 24 horas por dia, 7 dias por semana, não garantimos disponibilidade ininterrupta devido a:
          </p>
          <ul className="legal-page-list">
            <li>Manutenções programadas (comunicadas com antecedência mínima de 48 horas)</li>
            <li>Manutenções emergenciais de segurança</li>
            <li>Atualizações de sistema</li>
            <li>Eventos de força maior</li>
          </ul>
          <p className="legal-page-text">
            Recomendamos que os usuários mantenham procedimentos alternativos para situações de indisponibilidade do sistema.
          </p>

          <h2 className="legal-page-section-title">10. Modificações dos Termos</h2>
          <p className="legal-page-text">
            Reservamos o direito de modificar estes Termos de Uso a qualquer momento. Alterações serão:
          </p>
          <ul className="legal-page-list">
            <li>Publicadas nesta página com data de atualização</li>
            <li>Comunicadas por e-mail para alterações significativas</li>
            <li>Notificadas no sistema na próxima autenticação</li>
          </ul>
          <p className="legal-page-text">
            O uso continuado do sistema após as modificações constitui aceitação dos novos termos.
          </p>

          <h2 className="legal-page-section-title">11. Suspensão e Rescisão</h2>
          <p className="legal-page-text"><strong>11.1. Suspensão Imediata:</strong></p>
          <p className="legal-page-text">Podemos suspender ou encerrar o acesso ao sistema imediatamente, sem aviso prévio, em caso de:</p>
          <ul className="legal-page-list">
            <li>Violação destes Termos de Uso</li>
            <li>Violação da Política de Privacidade</li>
            <li>Uso fraudulento ou ilegal do sistema</li>
            <li>Comprometimento da segurança do sistema</li>
            <li>Determinação judicial ou de autoridade competente</li>
          </ul>
          <p className="legal-page-text"><strong>11.2. Rescisão pelo Usuário:</strong></p>
          <p className="legal-page-text">Você pode encerrar sua conta a qualquer momento, solicitando através do e-mail contato@magnolia.com.br. Os dados serão mantidos pelo período legal obrigatório.</p>

          <h2 className="legal-page-section-title">12. Legislação Aplicável e Foro</h2>
          <p className="legal-page-text">
            Estes Termos de Uso são regidos pela legislação brasileira, especialmente:
          </p>
          <ul className="legal-page-list">
            <li>Lei nº 13.709/2018 (LGPD)</li>
            <li>Lei nº 12.965/2014 (Marco Civil da Internet)</li>
            <li>Lei nº 8.078/1990 (Código de Defesa do Consumidor)</li>
            <li>Lei nº 10.406/2002 (Código Civil)</li>
            <li>Código de Ética Médica (Resolução CFM nº 2.217/2018)</li>
          </ul>

          <h2 className="legal-page-section-title">13. Contato</h2>
          <p className="legal-page-text">
            Para dúvidas, sugestões ou reclamações sobre estes Termos de Uso:
          </p>
          <p className="legal-page-text">
            <strong>E-mail:</strong> contato@magnolia.com.br<br/>
            <strong>Telefone:</strong> (11) 0000-0000<br/>
            <strong>Encarregado de Dados (DPO):</strong> dpo@magnolia.com.br
          </p>
        </div>
        </div>
      </Container>
    </PublicLayout>
  );
}
