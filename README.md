# 🐾 PETNET – Front-End

O **PETNET** é uma plataforma desenvolvida para facilitar a gestão de pet shops, aproximando clientes, administradores e colaboradores em um único sistema.

Nesta versão, o projeto conta com o **frontend completo em React + Vite**, incluindo fluxo de login, cadastro de usuários, cadastro de pets, serviços, agendamentos, área do cliente, área administrativa, área do colaborador e tela de logs para acompanhamento técnico.

O sistema foi desenvolvido com foco em **usabilidade, responsividade, organização visual e experiência do usuário**, utilizando uma identidade visual própria baseada nas cores azul e amarelo do PETNET.

---

## 👥 Equipe de Desenvolvimento

* **Beatriz Barbosa Moscardini**
* **Guilherme Fagundes Framil**
* **Mariana Guerra Ferraz**
* **Rafaela Campos Corrêa Santos**
* **Wagner Campos Pacheco Bernardes dos Santos**

---

## 🎯 Objetivos Principais

* Criar uma interface moderna, intuitiva e responsiva para pet shops.
* Facilitar o gerenciamento de clientes, pets, serviços e agendamentos.
* Permitir que clientes acompanhem seus próprios dados, pets e agendamentos.
* Fornecer ao administrador uma área completa de gestão.
* Disponibilizar ao colaborador uma agenda visual para acompanhamento dos atendimentos.
* Criar uma experiência amigável tanto para usuários finais quanto para a equipe interna.
* Estruturar o projeto seguindo boas práticas de React, componentização e organização de pastas.

---

## 🖥️ Telas e Funcionalidades Implementadas

| Página / Componente      | Descrição                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Home / Landing Page**  | Página inicial com banner, apresentação do PETNET, serviços, etapas, promoções, FAQ e localização                 |
| **Conta / Login**        | Tela de login para cliente, administrador, colaborador e dev                                                      |
| **Criar Conta**          | Formulário de cadastro de novos usuários                                                                          |
| **Minha Conta**          | Área do usuário com dados pessoais, edição de informações, contatos, endereços, pets e agendamentos               |
| **Reset Password**       | Tela para redefinição de senha por link recebido no e-mail                                                        |
| **Serviços**             | Listagem dinâmica dos serviços disponíveis                                                                        |
| **Pets**                 | Área para cadastro e visualização de pets                                                                         |
| **Meus Agendamentos**    | Tela do cliente para acompanhar seus próprios agendamentos e visualizar detalhes                                  |
| **Administração**        | Dashboard administrativo com indicadores, gráficos, agenda do dia e atividades recentes                           |
| **Agendamentos**         | Tela administrativa para criar agendamentos com cliente, pet, colaborador, serviço, duração, horário e calendário |
| **Clientes / Usuários**  | Listagem de usuários com busca, filtros, status, detalhes, edição e pets vinculados                               |
| **Pets Cadastrados**     | Listagem administrativa de pets com busca, filtros e detalhes                                                     |
| **Criar Serviços**       | Área administrativa para cadastrar, listar e gerenciar serviços                                                   |
| **Colaborador / Agenda** | Tela para colaboradores acompanharem a agenda e os status dos atendimentos                                        |
| **Logs do Sistema**      | Tela restrita ao dev para visualizar ações realizadas no sistema, com filtros e detalhes                          |
| **Header**               | Navbar dinâmica conforme o tipo de usuário logado                                                                 |
| **Footer**               | Rodapé responsivo com contato, horário e inscrição por e-mail                                                     |
| **ScrollToTopButton**    | Botão global para voltar ao topo da página                                                                        |
| **ProtectedRoute**       | Controle de acesso às rotas protegidas                                                                            |

---

## 🗂️ Estrutura de Pastas do Projeto

```bash
PETNET-code/
│── index.html
│── package.json
│── vite.config.js
│── README.md
│
└── src/
    ├── assets/
    │   ├── icons/              # Ícones utilizados no sistema
    │   └── images/             # Imagens e ilustrações
    │
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── Hero.jsx
    │   ├── About.jsx
    │   ├── Services.jsx
    │   ├── Steps.jsx
    │   ├── Promotions.jsx
    │   ├── FAQ.jsx
    │   ├── Location.jsx
    │   ├── GlobalStyles.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── LoadingScreen.jsx
    │   ├── ScrollToTop.jsx
    │   └── ScrollToTopButton.jsx
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── Conta.jsx
    │   ├── Criar_conta.jsx
    │   ├── Minha_conta.jsx
    │   ├── ResetPassword.jsx
    │   ├── Servicos.jsx
    │   ├── Pets.jsx
    │   ├── MeusAgendamentos.jsx
    │   ├── Administracao.jsx
    │   ├── Agendamentos.jsx
    │   ├── Clientes.jsx
    │   ├── Pets_cadastrados.jsx
    │   ├── AdminServicos.jsx
    │   ├── Colaborador.jsx
    │   ├── Status.jsx
    │   ├── Logs.jsx
    │   └── NovoUsuario.jsx
    │
    ├── services/
    │   ├── userService.js
    │   ├── petService.js
    │   ├── serviceService.js
    │   └── scheduleService.js
    │
    ├── styles/
    │   ├── header.css
    │   ├── footer.css
    │   ├── home.css
    │   ├── conta.css
    │   ├── criarConta.css
    │   ├── minhaConta.css
    │   ├── servicos.css
    │   ├── pets.css
    │   ├── meusAgendamentos.css
    │   ├── administracao.css
    │   ├── agendamentos.css
    │   ├── clientes.css
    │   ├── petsRegistrados.css
    │   ├── adminServicos.css
    │   ├── colaborador.css
    │   ├── status.css
    │   └── logs.css
    │
    ├── utils/
    │   ├── emailNotifications.js
    │   └── notificacoesLocal.js
    │
    ├── App.jsx
    └── main.jsx
```

---

## ⚙️ Tecnologias Utilizadas

| Categoria                   | Tecnologias                                           |
| --------------------------- | ----------------------------------------------------- |
| **Base**                    | React + Vite                                          |
| **Linguagem**               | JavaScript                                            |
| **Roteamento**              | React Router DOM                                      |
| **Estilização**             | CSS puro e responsivo                                 |
| **Ícones**                  | React Icons, Lucide React e ícones próprios           |
| **Tabelas**                 | React Data Table Component                            |
| **Gráficos**                | ApexCharts                                            |
| **Calendário**              | DayPicker / calendário interativo                     |
| **Notificações por e-mail** | EmailJS                                               |
| **Persistência temporária** | LocalStorage                                          |
| **Integração com API**      | Services para usuários, pets, serviços e agendamentos |
| **Controle de acesso**      | ProtectedRoute e flags de tipo de usuário             |

---

## 🎨 Design System

### Paleta de Cores

| Cor              | Código    |
| ---------------- | --------- |
| Azul principal   | `#3370EB` |
| Amarelo destaque | `#F9EE7C` |
| Branco           | `#FFFFFF` |
| Preto            | `#000000` |
| Fundo claro      | `#F4F8FF` |
| Texto suave      | `#6C7B9A` |

---

### Identidade Visual

O PETNET utiliza uma identidade visual leve e amigável, com foco em:

* Cards arredondados.
* Ícones relacionados a pets e agenda.
* Cores suaves.
* Elementos visuais em azul e amarelo.
* Interfaces responsivas para desktop, tablet e celular.
* Layouts diferentes conforme o perfil do usuário.

---

## 🔐 Perfis de Usuário

O sistema possui navegação e permissões diferentes conforme o tipo de usuário:

| Perfil            | Acesso                                                     |
| ----------------- | ---------------------------------------------------------- |
| **Cliente**       | Home, Serviços, Pets, Agenda e Minha Conta                 |
| **Administrador** | Dashboard, agendamentos, serviços, clientes, pets e status |
| **Colaborador**   | Agenda de atendimentos e conta                             |
| **Dev**           | Acesso técnico à tela de logs                              |

---

## 🧠 Regras de Negócio

* Clientes podem visualizar seus dados, pets e agendamentos.
* Administradores podem gerenciar usuários, pets, serviços e agendamentos.
* Colaboradores acompanham a agenda e os status dos atendimentos.
* A criação de agendamento exige cliente, pet, colaborador, serviço, duração, data e horário.
* O horário só pode ser informado após a seleção de uma data no calendário.
* Usuários podem ser ativados ou desativados pelo administrador.
* A tela de logs é restrita ao perfil dev.
* Logs são tratados como registros imutáveis.
* Serviços podem ser cadastrados e gerenciados pelo administrador.
* O sistema exibe mensagens de erro, sucesso e confirmação para orientar o usuário.
* O envio de e-mails é feito por EmailJS em fluxos específicos.
* A responsividade foi ajustada para desktop, notebook, tablet e celular.

---

## 📱 Responsividade

O projeto possui ajustes específicos para diferentes tamanhos de tela:

* **Desktop:** layout completo com cards, tabelas e painéis laterais.
* **Notebook:** telas administrativas otimizadas para evitar cortes.
* **Tablet:** navbar convertida em menu hambúrguer, tabelas com rolagem horizontal e cards reorganizados.
* **Celular:** filtros empilhados, botões em largura total, cards em uma coluna e modais adaptados.

Telas com tabelas, como **Clientes**, **Pets Cadastrados** e **Logs**, utilizam rolagem horizontal para preservar a legibilidade das colunas.

---

## ✉️ Integração com EmailJS

O projeto possui integração com **EmailJS** para envio de notificações por e-mail.

Funcionalidades relacionadas:

* Inscrição na newsletter pelo rodapé.
* Modal de confirmação após inscrição.
* Estrutura preparada para notificações de agendamento.

As credenciais são utilizadas por variáveis de ambiente:

```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

---

## 🚀 Como Rodar o Projeto

```bash
# Clonar o repositório
git clone https://github.com/Rafacampos16/PETNET-code.git

# Entrar na pasta
cd PETNET-code

# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

---

## 📸 Protótipo

🔗 Figma: https://www.figma.com/design/ZWN7I2H0pkGLh5n4YCt7iJ/PETNET

---

## ✅ Status Atual do Projeto

O frontend do PETNET conta atualmente com:

* Interface principal do cliente.
* Área administrativa completa.
* Área do colaborador.
* Tela de logs para dev.
* Cadastro e listagem de usuários.
* Cadastro e listagem de pets.
* Cadastro e gerenciamento de serviços.
* Criação de agendamentos.
* Visualização de agendamentos pelo cliente.
* Dashboard administrativo.
* Responsividade ajustada para diferentes dispositivos.
* Integração inicial com backend via services.
* Integração com EmailJS.

---

## 🧩 Próximos Passos

* Finalizar integração completa com o backend.
* Ajustar autenticação com JWT.
* Persistir notificações internas no banco de dados.
* Criar rotina real de lembrete de agendamento.
* Integrar confirmação automática de agendamentos por e-mail.
* Melhorar regras de disponibilidade da agenda.
* Implementar controle mais detalhado de permissões.
* Realizar testes finais de usabilidade.
* Publicar versão final no Netlify.

---

## 🌐 Deploy

O deploy do projeto está previsto para ser realizado no **Netlify**.

---

## 📌 Observações

Este projeto foi desenvolvido como parte do Projeto Integrador, com foco em criar uma solução prática para gestão de pet shops, priorizando experiência do usuário, organização visual e funcionalidades essenciais para o funcionamento do sistema.
