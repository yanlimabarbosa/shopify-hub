# Shopify Hub

## Sobre o Projeto

O **Shopify Hub** é uma aplicação web que permite gerenciar e sincronizar produtos e pedidos de lojas Shopify de forma centralizada. A aplicação oferece:

- **Autenticação OAuth** com Shopify para conectar múltiplas lojas
- **Sincronização de dados** (produtos e pedidos) entre Shopify e a aplicação
- **Gerenciamento de webhooks** para receber atualizações em tempo real
- **Dashboard administrativo** com estatísticas e visão geral dos dados
- **Interface moderna** para visualizar e gerenciar produtos e pedidos

A aplicação é composta por um backend em Node.js/Express com TypeScript e um frontend em Next.js, tudo containerizado com Docker para facilitar o deploy e desenvolvimento.

---

# Guia de Configuração

## 1. Configurar ngrok

Execute no terminal:
```bash
ngrok http 3000
```

Copie o link do ngrok (ex: `ec8954.ngrok-free.app`) e salve para usar depois.

---

## 2. Criar Conta Partner no Shopify

1. Acesse [https://www.shopify.com/br/parcerias](https://www.shopify.com/br/parcerias)
2. Clique em **"Sign up"** ou **"Cadastrar"** no canto superior direito
3. Clique em **"Criar conta com o Google"** e autentique-se
4. Na tela de perguntas, selecione: **"Criar e configurar uma nova organização parceira"**
5. Selecione a opção: **"Criação de Apps"**
6. Selecione seu país/estado
7. Preencha o formulário com suas informações de contato
8. Clique em **"Criar organização Parceira"**

Após isso você será redirecionado para a tela do Partner Dashboard:

<img width="1910" height="944" alt="print-1" src="https://github.com/user-attachments/assets/a83ca937-5de8-4bc8-a66d-fa6846872f2b" style="max-width: 700px;"/>

## 3. Criar App no Shopify

1. No canto superior direito, clique no seu perfil:

    <img width="260" height="319" alt="print-2" src="https://github.com/user-attachments/assets/c676aea2-98b8-49a1-8aac-4045b2b04001" style="max-width: 700px;" />

2. Clique em **"Dev Dashboard"**

3. Autentique-se novamente se necessário:

   <img width="1575" height="938" alt="print-3" src="https://github.com/user-attachments/assets/ff20bfe1-46d7-4844-bc5a-22ccb4fabbae" style="max-width: 700px;" />
4. Você será redirecionado para esta página:

    <img width="1916" height="946" alt="print-4" src="https://github.com/user-attachments/assets/01ee7e90-0130-4369-9595-e8b1a996b10c" style="max-width: 700px;" />

5. Clique em **"Create app"**

6. Dê um nome ao seu app e clique em **"Create"**:

    <img width="1915" height="588" alt="print-5" src="https://github.com/user-attachments/assets/5d2fcfec-0d34-4d99-b72b-06b56df4d12a" style="max-width: 700px;" />

---

## 4. Configurar App

1. Você será redirecionado para a página **"Create a version"**
2. Cole o link do ngrok no campo **"App URL"**
3. Role para baixo e defina os seguintes escopos:
   ```
   read_orders,write_orders,read_products,write_products
   ```
4. No campo **"Redirect URL"**, coloque:
   ```
   seu-link-do-ngrok/shopify/callback
   ```

   <img width="1457" height="1052" alt="print-6" src="https://github.com/user-attachments/assets/62a97f02-043c-4bfd-9848-524aabe3c13d" style="max-width: 700px;" />
5. Role até o final da página e clique em **"Release"**

---

## 5. Obter Credenciais da API

1. Após o release, clique em **"Apps"** na barra lateral esquerda do "dev dashboard"

2. Clique no app que foi criado:

    <img width="1517" height="251" alt="print-7" src="https://github.com/user-attachments/assets/bc759d60-9343-465a-a5e2-16986694c892" style="max-width: 700px;" />

3. Na barra lateral, clique em **"Settings"**
4. Copie o **"Client ID"** e **"Secret"**
5. Cole no arquivo `.env` na raiz do projeto:
   - **Client ID** → `SHOPIFY_API_KEY`
   - **Secret** → `SHOPIFY_API_SECRET`

---

## 6. Iniciar Aplicação

Execute no terminal:
```bash
docker-compose up -d --build
```

Caso queira visualizar o banco de dados de forma rápida, rode o comando:
```bash
docker exec -it shopify-hub-backend npx prisma studio
```

Depois acesse [http://localhost:5555](http://localhost:5555) no navegador.

---

## 7. Criar Conta de Usuário

1. Acesse o frontend: [http://localhost:8080](http://localhost:8080)

2. Clique em **"Registrar"**:

    <img width="1916" height="936" alt="print-8" src="https://github.com/user-attachments/assets/0b5b77ae-ccf0-4791-85d5-97f2771eb14d" style="max-width: 700px;" />

3. Insira suas credenciais para criar a conta
   - **Nota:** O primeiro usuário do sistema terá role de **ADMIN**, os outros serão **USER**

Você será redirecionado para esta tela:

  <img width="1909" height="936" alt="print-9" src="https://github.com/user-attachments/assets/90d30770-f7c8-42ec-b203-b994f014f29b" style="max-width: 700px;" />

---

## 8. Criar Loja de Desenvolvimento

1. Volte para [dev.shopify.com](https://dev.shopify.com)

2. Selecione **"Dev stores"** na barra lateral

3. Clique em **"Create dev store"**:

    <img width="1918" height="524" alt="print-10" src="https://github.com/user-attachments/assets/0c8b7169-5d87-411b-951e-dc648e068f15" style="max-width: 700px;" />

4. Digite o nome da loja

5. Selecione o plano **"Basic"**

6. Marque a checkbox **"Gerar dados de teste para a loja"**:

    <img width="974" height="664" alt="print-11" src="https://github.com/user-attachments/assets/deeef351-6723-449f-86b3-07775ff67f01" style="max-width: 700px;" />

7. Clique em **"Create"**

Após sua loja ser construída, você será redirecionado para esta página:

<img width="1912" height="978" alt="print-12" src="https://github.com/user-attachments/assets/6c70a654-1cd2-4ed3-8e45-46d626ff5630" style="max-width: 700px;" />

Note que na URL no topo tem o slug da loja (ex: `loja-yan-9628`). Seu domínio será:
```
https://loja-yan-9628.myshopify.com
```

---

## 9. Conectar Loja

1. No frontend, vá para a página **"OAuth shopify"**

2. Cole o domínio da loja (ex: `loja-yan-9628.myshopify.com`)

3. Clique em **"Conectar loja"**:

    <img width="1917" height="939" alt="print-13" src="https://github.com/user-attachments/assets/7c068dbf-f633-41ad-a3c3-91408840f01d" style="max-width: 700px;" />

4. Você será redirecionado para esta página:

    <img width="1918" height="942" alt="print-14" src="https://github.com/user-attachments/assets/ba9edfaf-a2c2-44a1-ab37-a0ea30336b45" style="max-width: 700px;" />

5. Clique em **"Instalar"**

6. Você será redirecionado de volta para a aplicação:

    <img width="1895" height="936" alt="print-15" src="https://github.com/user-attachments/assets/fb1ecd70-078b-44c5-8f2f-4594cb2354a9" style="max-width: 700px;" />

---

## 10. Sincronizar Dados

1. Na página **"Sincronizar"**, clique nos botões para fazer a sincronização

2. Aparecerá uma mensagem de sucesso

3. Os itens (pedidos e produtos) serão listados em suas respectivas páginas:

    <img width="1912" height="1069" alt="print-16" src="https://github.com/user-attachments/assets/a9d7711f-e6f4-4884-94e6-6f488ba7cac3" style="max-width: 700px;" />

    <img width="1910" height="1073" alt="print-17" src="https://github.com/user-attachments/assets/7701bd54-5579-46fe-bc40-81d9ddcf7e28" style="max-width: 700px;" />

---

## 11. Registrar Webhooks

1. Vá para a página **"Webhooks"**

2. Clique em **"Registrar webhooks"**:

   <img width="1915" height="1078" alt="print-18" src="https://github.com/user-attachments/assets/52281207-0f49-4b79-b280-1834f2b0d91d" style="max-width: 700px;" />
   - **Nota:** Se não preencher o domínio, será usado automaticamente a loja mais recente cadastrada no banco
    
    Após cadastrar os webhooks, talvez apareça o seguinte erro:
    
    <img width="1913" height="1079" alt="print-19" src="https://github.com/user-attachments/assets/2dfa2a19-6c92-40a6-99c6-e2d83a5e608a" style="max-width: 700px;" />

### Para corrigir o erro de permissão:

1. Acesse [partners.shopify.com](https://partners.shopify.com)

2. Clique na barra lateral em **"Todos os Apps"** e abra seu app:

    <img width="1912" height="942" alt="print-20" src="https://github.com/user-attachments/assets/73a18119-9608-4d3c-9f65-440c1384817c" style="max-width: 700px;" />

3. Clique no menu lateral em **"Solicitações de acesso da API"**:

    <img width="1914" height="932" alt="print-21" src="https://github.com/user-attachments/assets/bc4da8ad-9b76-425e-b70d-0bf55a5ba34e" style="max-width: 700px;" />

4. Role até encontrar a opção **"Gerenciamento da loja"**

5. Marque a checkbox e clique em **"Salvar"**:

    <img width="1898" height="936" alt="print-22" src="https://github.com/user-attachments/assets/0aef2c58-f595-42e1-ad6a-7afd53609787" style="max-width: 700px;" />

6. Volte para a aplicação e clique em **"Registrar webhook"** novamente:

    <img width="1915" height="934" alt="print-23" src="https://github.com/user-attachments/assets/468ef806-af7b-4e8a-9f79-cf3c9ccf0e7a" />

---

## 12. Pronto!

A partir de agora, todos os novos produtos e pedidos criados diretamente no Shopify aparecerão automaticamente na aplicação através dos webhooks.

---

## ✅ Checklist de Requisitos

### A) Autenticação e Autorização ✅
- ✅ JWT access token implementado
- ✅ Roles: `ADMIN` e `USER` implementados
- ✅ `POST /auth/register` - Registro de usuários
- ✅ `POST /auth/login` - Login com JWT
- ✅ `GET /me` - Endpoint para obter dados do usuário autenticado
- ✅ Middleware de autenticação (`requireAuth`)
- ✅ Middleware de autorização por role (`requireRole`)
- ✅ `ADMIN` pode: sync + registrar webhooks + dashboard
- ✅ `USER` pode: consultas (products/orders) + /me
- ✅ Hash de senha com `bcrypt`

### B) Shopify OAuth (App) ✅
- ✅ `GET /shopify/auth?shop=xxxxx.myshopify.com` - Iniciar fluxo OAuth
- ✅ `GET /shopify/callback` - Callback OAuth
- ✅ Persistência no banco:
  - ✅ `shopDomain`
  - ✅ `accessToken`
  - ✅ `scopes`
  - ✅ `installedAt`

### C) Sincronização Shopify → Banco (ADMIN) ✅
- ✅ `POST /sync/products` - Sincronizar produtos
- ✅ `POST /sync/orders` - Sincronizar pedidos
- ✅ Busca na Shopify Admin API
- ✅ Salvar/atualizar com **upsert** por `shopifyId` + `shopId`
- ✅ Campos mínimos de Produtos: `shopifyId`, `title`, `status`, `vendor`, `createdAtShopify`, `updatedAtShopify`
- ✅ Campos mínimos de Pedidos: `shopifyId`, `name`, `totalPrice`, `currency`, `financialStatus`, `createdAtShopify`, `updatedAtShopify`

### D) Webhooks via ngrok ✅
- ✅ `POST /webhooks/register` (ADMIN) - Criar webhooks na Shopify
- ✅ `POST /webhooks/shopify` (público) - Receber eventos
- ✅ Webhooks implementados:
  - ✅ `products/create`
  - ✅ `products/update`
  - ✅ `orders/create`
  - ✅ `orders/updated`
- ✅ Validação de assinatura HMAC do webhook

### E) Consultas (USER/ADMIN) ✅
- ✅ `GET /products?limit=&cursor=` - Listar produtos com paginação
- ✅ `GET /orders?limit=&cursor=` - Listar pedidos com paginação

### F) Dashboard (ADMIN) ✅
- ✅ `GET /dashboard` - Endpoint de dashboard
- ✅ Retorna contadores:
  - ✅ Total de produtos
  - ✅ Total de pedidos
  - ✅ Pedidos nas últimas 24h

### Bônus ✅
- ✅ **Idempotência de webhook** - Prevenção de processamento duplicado
- ✅ **Tabela `webhook_events`** - Salvando `topic` + payload
- ✅ **Docker compose** - App + PostgreSQL containerizados
- ✅ **Frontend completo** - Interface moderna em Next.js
- ✅ **Swagger/OpenAPI** - Documentação da API em localhost:3000/api-docs
- ✅ **TypeScript** - Tipagem completa
- ✅ **Validação com Zod** - Schemas de validação
- ✅ **Tratamento de erros centralizado** - Middleware de error handling
- ✅ **Logging estruturado** - Sistema de logs

---

**Stack utilizada:** Node.js + TypeScript + Express + Prisma + PostgreSQL + Next.js + Docker
