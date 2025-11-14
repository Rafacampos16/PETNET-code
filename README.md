# 🐾 PetNet – Front-End

O **PetNet** é uma plataforma desenvolvida para facilitar a gestão interna e o relacionamento entre pet shops e seus clientes.  
Nesta versão, o foco é **o frontend completo**, incluindo fluxo de cadastros, pets, serviços e um painel administrativo.

Este projeto foi desenvolvido em **React + Vite**, com foco em usabilidade, responsividade e um design moderno inspirado em padrões reais de mercado.

---

## 👥 Equipe de Desenvolvimento
- **Beatriz Barbosa Moscardini**  
- **Guilherme Fagundes Framil**  
- **Mariana Guerra Ferraz**  
- **Rafaela Campos Corrêa Santos**  
- **Wagner Campos Pacheco Bernardes dos Santos**  

---

## 🎯 Objetivos Principais
- Criar uma interface moderna e responsiva para pet shops.  
- Facilitar o fluxo de agendamento por meio de WhatsApp.  
- Fornecer ao gerente acesso aos cadastros e agendamentos.  
- Prototipar e implementar telas funcionais do sistema.  
- Estruturar o projeto seguindo boas práticas de React.

---

## 🖥️ Telas Implementadas

| Página / Componente | Descrição |
|----------------------|-----------|
| **Landing Page** | Banner, apresentação dos serviços e navegação principal |
| **Conta (Login)** | Login de clientes e login administrativo |
| **Cadastro de Usuário** | Formulário para criação de conta |
| **Cadastro de Pet** | Adicionar informações do pet do cliente |
| **Serviços** | Lista de serviços com botão para agendar via WhatsApp |
| **Pets** | Listagem dos pets cadastrados |
| **Administração (Painel)** | Controle de usuários, pets e agendamentos |
| **FAQ** | Perguntas frequentes |
| **Sobre / Localização / Promoções** | Informações complementares |
| **Footer & Header** | Layout principal reutilizável |

---

## 🗂️ Estrutura de Pastas do Projeto Atual

```bash
PETNET/
│── index.html
│── package.json
│── vite.config.js
│── tailwind.config.js
│
└── src/
    ├── assets/           # Imagens e ícones
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── Hero.jsx
    │   ├── Services.jsx
    │   ├── About.jsx
    │   ├── FAQ.jsx
    │   ├── Location.jsx
    │   ├── Promotions.jsx
    │   ├── Steps.jsx
    │   └── ProtectedRoute.jsx
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── Conta.jsx
    │   ├── Pets.jsx
    │   ├── Servicos.jsx
    │   └── Administracao.jsx
    │
    ├── styles/            # Arquivos .css
    ├── App.jsx
    └── main.jsx
```
## ⚙️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|----------|-------------|
| **Base** | React + Vite |
| **Estilização** | TailwindCSS + CSS modular |
| **Ícones** | Material UI Icons |
| **Roteamento** | React Router DOM |
| **Validação** | (em expansão) |
| **Controle de Acesso** | Context + ProtectedRoute |
| **Qualidade** | ESLint |

---

## 🎨 Design System

### 🎨 Paleta de Cores

| Cor | Código |
|------|--------|
| Azul principal | `#3370EB` |
| Amarelo destaque | `#F9EE7C` |
| Branco | `#FFFFFF` |
| Preto | `#000000` |

---

### ✍️ Tipografia

| Fonte | Uso |
|--------|------|
| **Montserrat** | Títulos |
| **Roboto** | Textos |
| **Open Sans** | Labels |
| **Source Code Pro** | Dados / números |

---

## 🧠 Regras de Negócio

- O agendamento é finalizado pelo **gerente via WhatsApp**.  
- O cliente **não agenda sozinho** pelo sistema.  
- Colaboradores podem alterar status para:  
  - **Em andamento**  
  - **Finalizado**  
- E-mails são obrigatórios e validados.  
- O sistema exibe mensagens informativas a cada ação.

---

## 🚀 Como Rodar o Projeto

```bash
# Clonar o repositório
git clone https://github.com/Rafacampos16/PETNET-code.git

# Entrar na pasta
cd PETNET-code

# Instalar dependências
npm install

# Rodar o servidor
npm run dev
```

### 📸 Protótipo (Figma)

🔗 https://www.figma.com/design/ZWN7I2H0pkGLh5n4YCt7iJ/PETNET

### 🧩 Próximos Passos (Roadmap)

- 🔄 Conectar com o backend PetNet (API REST)
- 🛡️ Implementar autenticação completa com JWT
- 📅 Criar sistema de agendamento dinâmico
- 🐶 CRUD completo de pets e usuários
- ⚙️ Dashboard administrativo funcional
- 📱 Melhorias de responsividade e acessibilidade
- ⭐ Deploy no Netlify



