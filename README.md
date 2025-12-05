# Izanagi 🎎

Um aplicativo web moderno para gestão de hábitos e rastreamento de progresso pessoal com interface intuitiva e sistema de conquistas.

## 🚀 Features

- **Dashboard Personalizado**: Acompanhe seu progresso diário com estatísticas em tempo real
- **Gerenciamento de Hábitos**: Crie, edite e acompanhe seus hábitos diários
- **Sistema de Conquistas**: Desbloqueie badges à medida que atinge suas metas
- **Tema Claro/Escuro**: Modo noturno automático para conforto visual
- **Sincronização em Tempo Real**: Todos os dados sincronizados com Supabase
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🛠️ Stack Tecnológico

- **Frontend Framework**: React 19 com TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS + PostCSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack React Query + Context API
- **Formulários**: React Hook Form + Zod
- **Validação**: Zod
- **Animações**: Framer Motion
- **UI Icons**: Lucide React
- **Roteamento**: React Router 7
- **Linting**: ESLint

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase (para backend)

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/izanagi.git
cd izanagi
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Adicione suas credenciais do Supabase em `.env.local`:
```
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── dashboard/      # Componentes de dashboard
│   ├── landing/        # Componentes da página inicial
│   ├── layout/         # Layout e navegação
│   └── ui/            # Componentes UI base (Button, Card, etc)
├── context/           # Context API (Auth, Theme)
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
│   ├── achievements/  # Página de conquistas
│   ├── auth/          # Páginas de login/registro
│   ├── dashboard/     # Dashboard
│   ├── habits/        # Gerenciamento de hábitos
│   ├── landing/       # Landing page pública
│   └── profile/       # Perfil do usuário
├── services/          # Serviços (Supabase, APIs)
├── utils/             # Funções utilitárias
├── App.tsx            # Roteamento principal
└── main.tsx           # Entry point
```

## 🔐 Autenticação

O projeto usa Supabase Auth para gerenciar autenticação com suporte a:
- Registro com email/senha
- Login com email/senha
- Proteção de rotas privadas

## 📊 Banco de Dados

Estrutura do Supabase:
- **users**: Perfis de usuários
- **habits**: Hábitos criados pelos usuários
- **habit_logs**: Histórico diário de hábitos
- **achievements**: Sistema de achievements

## 🎨 Temas e Customização

O projeto utiliza Tailwind CSS com variáveis customizadas. Para modificar cores e estilos, edite `tailwind.config.js`.

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja `LICENSE` para mais detalhes.

## 👤 Autor

**Seu Nome**
- GitHub: [@shwdaniel7](https://github.com/shwdaniel7)

## 📞 Suporte

Se tiver dúvidas ou encontrar problemas, abra uma issue no repositório.

---

Desenvolvido usando React + TypeScript + Vite

