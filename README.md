<h1 align="center">
  <img alt="LetMeAsk" src=".github/logo.svg">
</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">Como executar</a>
</p>

<br>

<p align="center">
  <img alt="Project Mockup" src=".github/mockup.png" width="100%">
</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Sass](https://sass-lang.com/)
- [Firebase](https://firebase.google.com/)

## 💻 Projeto

<h4> Acesse em: https://nlw6-let-me-ask.vercel.app/ </h4>

O LetMeAsk é um aplicativo para a realização de perguntas em tempo real durante lives, utilizando o [Firebase](https://firebase.google.com/) para autenticação e banco de dados, feito durante o evento `Next Level Week 6`, da [Rocketseat](https://github.com/rocketseat-education).

## 🚀 Funcionalidades que adicionei além do evento

- Dark theme
- Responsividade
- `Regras de negócio no Front-End`: permitir acesso à página de admin somente ao criador da sala, não permitir que usuários não-logados consigam enviar perguntas, dentre outras verificações.
- `React Hot Toasts`: PopUps sucintos com aparência agradável para informar o usuário informações relevantes.
- `React Modal`: Modais de confirmação claros e com boas práticas de acessibilidade.
- Diferentes respostas ao usuário caso não seja possível entrar na sala requisitada.
- Melhorias gerais no design da aplicação

## 🔖 Layout

Você pode visualizar o layout do projeto através [desse link](https://www.figma.com/file/GLf2gn6jHd5u2xScZGroLW/LetMeAsk-NLW-6-ReactJS). É necessário ter uma conta no [Figma](http://figma.com/) para acessá-lo.

## 🚀 Como executar

- Clone o repositório
- Crie um projeto no [Firebase](https://firebase.google.com/)
- Na aba `Authentication`, ative a autenticação com o Google
- Crie um banco de dados com o Realtime Database
- Registre seu projeto como um app Web, na aba Visão Geral do Projeto
- Preencha as variáveis ambiente com os dados do seu projeto, de acordo com o arquivo `.env.example`
- Instale as dependências com `yarn`
- Inicie o servidor com `yarn start`

Agora você pode acessar [`localhost:3000`](http://localhost:3000) do seu navegador.

---

<h4 align="center"> Feito com ♥ por Marcelino Teixeira </h4>
