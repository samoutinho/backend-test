# Thera Consulting - Backend Test

API RESTful para gerenciamento de produtos e pedidos desenvolvida com NestJS, seguindo Clean Architecture e princípios SOLID.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript
- **Swagger** - Documentação da API
- **Docker** - Containerização
- **Jest** - Framework de testes

## 📋 Pré-requisitos

- Node.js 20+ instalado
- Docker e Docker Compose instalados
- npm ou yarn

## 🛠️ Instalação e Configuração

### Opção 1: Usando Docker (Recomendado)

1. **Clone o repositório** (ou navegue até o diretório do projeto):
   ```bash
   cd backend-test
   ```

2. **Crie um arquivo `.env`** na raiz do projeto (copie de `.env.example` se existir):
   ```env
   DATABASE_HOST=postgres
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=thera_consulting_db
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   ```

3. **Suba os containers**:
   ```bash
   docker-compose up -d
   ```

   Isso irá:
   - Criar e iniciar o container do PostgreSQL
   - Criar e iniciar o container da aplicação NestJS
   - Configurar automaticamente o banco de dados

4. **Acesse a aplicação**:
   - API: http://localhost:3001
   - Swagger: http://localhost:3001/api
   
   **Nota**: A aplicação está configurada para rodar na porta 3001 para evitar conflitos com outras aplicações.

### Opção 2: Instalação Local (Sem Docker)

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Configure o PostgreSQL**:
   - Certifique-se de que o PostgreSQL está rodando
   - Crie um banco de dados chamado `thera_consulting_db`

3. **Crie um arquivo `.env`** na raiz do projeto:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=sua_senha
   DATABASE_NAME=thera_consulting_db
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   ```
   
   **Nota**: A aplicação está configurada para rodar na porta 3001 para evitar conflitos com outras aplicações.

4. **Execute as migrações**:
   ```bash
   npm run migration:run
   ```
   
   Isso criará as tabelas: `products`, `orders` e `users`.

5. **Execute os seeders** (opcional, para dados iniciais):
   ```bash
   npm run seed:run
   ```
   
   Isso criará usuários de teste e produtos de exemplo.
   
   **Usuários padrão criados:**
   - Email: `admin@thera.com` / Senha: `admin123`
   - Email: `test@thera.com` / Senha: `test123`

6. **Inicie a aplicação**:
   ```bash
   # Desenvolvimento
   npm run start:dev

   # Produção
   npm run build
   PORT=3001 npm run start:prod
   ```

   **Nota**: A aplicação roda na porta 3001 por padrão. Para usar outra porta, defina a variável `PORT` no `.env`.

## 🧪 Executando os Testes

### Executar todos os testes:
```bash
npm test
```

### Executar testes em modo watch:
```bash
npm run test:watch
```

### Executar testes com cobertura:
```bash
npm run test:cov
```

### Executar testes E2E:
```bash
npm run test:e2e
```

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger quando a aplicação estiver rodando:

- **URL do Swagger**: http://localhost:3001/api

A documentação inclui:
- Todos os endpoints disponíveis
- Parâmetros de entrada
- Exemplos de requisições e respostas
- Possibilidade de testar os endpoints diretamente
- Autenticação JWT (use o botão "Authorize" no Swagger)

### Autenticação

A API utiliza JWT para autenticação. Para acessar os endpoints protegidos:

1. Faça login em `http://localhost:3001/auth/login` ou registre-se em `http://localhost:3001/auth/register`
2. Copie o `access_token` retornado
3. No Swagger (http://localhost:3001/api), clique em "Authorize" e cole o token no formato: `Bearer {token}`
4. Ou inclua no header: `Authorization: Bearer {token}`

## 🔌 Endpoints Principais

### Produtos

- `GET /products?page=1&limit=10` - Lista produtos com paginação (query params opcionais)
- `GET /products/:id` - Busca um produto por ID
- `POST /products` - Cria um novo produto (aceita campo `imagem` opcional com URL)
- `PUT /products/:id` - Atualiza um produto
- `DELETE /products/:id` - Remove um produto

**Exemplo de criação de produto com imagem:**
```json
{
  "nome": "Notebook Gamer",
  "categoria": "Eletrônicos",
  "preco": 4500.00,
  "descricao": "Notebook gamer com placa de vídeo dedicada",
  "imagem": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
  "quantidade_estoque": 10
}
```

### Pedidos

- `GET /orders` - Lista todos os pedidos (requer autenticação)
- `GET /orders/:id` - Busca um pedido por ID (requer autenticação)
- `POST /orders` - Cria um novo pedido (requer autenticação)
- `PUT /orders/:id/status` - Atualiza o status de um pedido (requer autenticação)

### Autenticação

- `POST /auth/register` - Registra um novo usuário (público)
- `POST /auth/login` - Faz login e retorna token JWT (público)

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com as seguintes camadas:

```
src/
├── domain/              # Entidades e interfaces (regras de negócio)
│   ├── entities/        # Entidades do domínio
│   └── interfaces/      # Contratos dos repositórios
├── application/         # Casos de uso e DTOs
│   ├── services/        # Lógica de negócio
│   ├── dto/            # Data Transfer Objects
│   └── modules/        # Módulos NestJS
├── infrastructure/      # Implementações técnicas
│   ├── repositories/   # Implementação dos repositórios
│   ├── database/       # Configuração do banco
│   └── middleware/     # Middlewares
└── presentation/        # Controllers e rotas
    └── controllers/    # Controllers REST
```

## 🔧 Scripts Disponíveis

- `npm run start` - Inicia a aplicação em modo produção
- `npm run start:dev` - Inicia em modo desenvolvimento com hot-reload
- `npm run start:debug` - Inicia em modo debug
- `npm run build` - Compila o projeto TypeScript
- `npm run test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:cov` - Executa testes com cobertura
- `npm run test:e2e` - Executa testes end-to-end
- `npm run lint` - Executa o linter
- `npm run migration:run` - Executa as migrations do banco de dados
- `npm run migration:revert` - Reverte a última migration
- `npm run seed:run` - Executa os seeders para popular o banco
- `npm run migration:run` - Executa as migrations do banco de dados
- `npm run migration:revert` - Reverte a última migration
- `npm run seed:run` - Executa os seeders para popular o banco

## 🐳 Comandos Docker Úteis

```bash
# Subir containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Parar e remover volumes (limpar banco)
docker-compose down -v

# Rebuild dos containers
docker-compose up -d --build
```

## 📝 Exemplo de Uso

### Criar um produto:
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Dell",
    "categoria": "Eletrônicos",
    "descricao": "Notebook Dell Inspiron 15",
    "preco": 2999.99,
    "quantidade_estoque": 10
  }'
```

### Criar um pedido:
```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{
    "produtos": [
      {
        "product_id": "123e4567-e89b-12d3-a456-426614174000",
        "quantity": 2
      }
    ]
  }'
```

## 🎯 Funcionalidades Implementadas

✅ CRUD completo de produtos
✅ Suporte a imagens de produtos (campo imagem com URL)
✅ Criação e listagem de pedidos
✅ Validação de estoque ao criar pedidos
✅ Atualização automática de estoque ao concluir pedidos
✅ Middleware de logging de requisições
✅ Validação de dados com class-validator
✅ Documentação Swagger (http://localhost:3001/api)
✅ Autenticação JWT com login e registro
✅ Migrations do banco de dados (4 migrations: products, orders, users, add_image_column)
✅ Paginação de produtos (page e limit como query parameters)
✅ Seeders para dados iniciais (produtos e usuários)
✅ Testes unitários (16 testes passando)
✅ Docker e Docker Compose
✅ Clean Architecture
✅ Princípios SOLID

## 🔒 Segurança

- Validação de entrada em todos os endpoints
- Tratamento de erros global
- CORS configurado
- JWT preparado para autenticação (extra implementado)

## 🚧 Implementações Futuras

### Arquitetura e Infraestrutura
- **Multitenancy**: Suporte a múltiplos tenants com isolamento completo de dados
  - Tabela `tenants` com configurações por tenant
  - Middleware de tenant resolution
  - Isolamento de dados por tenant_id
- **Cache Distribuído**: Implementação de Redis para cache de queries frequentes
- **Rate Limiting**: Proteção contra abuso com diferentes estratégias por endpoint
- **Queue System**: Sistema de filas para processamento assíncrono (Bull/BullMQ)
- **Event Sourcing**: Rastreamento completo de eventos do sistema

### Segurança e Autenticação
- **Reset de Senha**: 
  - Endpoint para solicitar reset via email
  - Tokens temporários com expiração
  - Integração com serviço de email (SendGrid, AWS SES)
- **Autenticação Multi-fator (MFA)**: 
  - Suporte a TOTP (Google Authenticator)
  - Backup codes para recuperação
- **Gestão de Permissões (RBAC)**: 
  - Tabela de roles e permissions
  - Middleware de autorização granular
  - Permissões por recurso e ação
- **OAuth2/SSO**: 
  - Integração com Google, GitHub, Microsoft
  - Suporte a SAML
- **Auditoria**: 
  - Tabela de audit_logs
  - Rastreamento de todas as ações críticas
  - Logs imutáveis

### Melhorias de Dados
- **Categorias como Entidade**: 
  - Criar tabela `categories` com relacionamento many-to-many
  - Migration para migrar dados existentes
  - Endpoints CRUD para categorias
  - Validação de categoria obrigatória
- **Tags e Etiquetas**: 
  - Tabela `tags` e `product_tags` (many-to-many)
  - Busca por tags
  - Sugestões de tags
- **Histórico de Alterações**: 
  - Tabela `product_history` para versionamento
  - Trigger ou hooks para capturar mudanças
  - API para visualizar histórico
- **Soft Delete**: 
  - Campo `deleted_at` em todas as tabelas principais
  - Queries automáticas excluindo deletados
  - Endpoint para restaurar registros

### Funcionalidades de Negócio
- **Carrinho de Compras**: 
  - Tabela `carts` e `cart_items`
  - Endpoints para gerenciar carrinho
  - Expiração automática de carrinhos abandonados
- **Sistema de Avaliações**: 
  - Tabela `reviews` com ratings
  - Média de avaliações por produto
  - Filtros por rating
- **Notificações**: 
  - Tabela `notifications`
  - WebSockets para notificações em tempo real
  - Templates de notificações
- **Relatórios e Analytics**: 
  - Endpoints de métricas e estatísticas
  - Agregações complexas
  - Exportação de relatórios
- **Exportação de Dados**: 
  - Endpoints para exportar em CSV, Excel, PDF
  - Jobs assíncronos para grandes volumes
- **Importação em Lote**: 
  - Endpoint para upload de arquivo CSV/Excel
  - Validação e processamento em lote
  - Relatório de erros de importação

### Upload e Armazenamento
- **Upload de Imagens**: 
  - Integração com AWS S3, Google Cloud Storage ou local
  - Redimensionamento automático de imagens
  - Suporte a múltiplas imagens por produto
  - CDN para distribuição de imagens

### Performance e Otimização
- **Índices de Banco**: 
  - Análise e otimização de queries
  - Índices compostos para buscas frequentes
- **Query Optimization**: 
  - Uso de select específicos
  - Eager loading otimizado
  - Paginação eficiente
- **Connection Pooling**: 
  - Configuração otimizada de pool de conexões
- **Database Replication**: 
  - Leitura de réplicas para queries de leitura

### Testes e Qualidade
- **Testes E2E**: 
  - Testes completos de fluxos de negócio
  - Testes de integração entre módulos
- **Testes de Performance**: 
  - Testes de carga (k6, Artillery)
  - Análise de gargalos
- **Testes de Segurança**: 
  - Análise de vulnerabilidades (OWASP)
  - Testes de penetração
- **Cobertura de Testes**: 
  - Aumentar cobertura para >80%
  - Testes de unidade para todos os serviços

### Documentação e API
- **Documentação de API Melhorada**: 
  - Exemplos mais detalhados no Swagger
  - Documentação de erros possíveis
  - Guias de integração
- **API GraphQL**: 
  - Adicionar endpoint GraphQL
  - Schema GraphQL completo
  - Resolvers otimizados
- **Versionamento de API**: 
  - Suporte a múltiplas versões (v1, v2)
  - Deprecação gradual de endpoints

### Integrações
- **Webhooks**: 
  - Sistema de webhooks configuráveis
  - Retry automático em caso de falha
  - Assinatura de eventos
- **Integração com Pagamentos**: 
  - Gateways de pagamento (Stripe, PagSeguro)
  - Processamento de pagamentos
- **Integração com Email**: 
  - Serviço de email transacional
  - Templates de email
- **Integração com ERP**: 
  - Conectores para sistemas ERP
  - Sincronização de dados

### Monitoramento e Observabilidade
- **Logs Estruturados**: 
  - Integração com ELK Stack ou similar
  - Logs em formato JSON
  - Níveis de log configuráveis
- **Métricas**: 
  - Integração com Prometheus
  - Dashboards no Grafana
- **Tracing**: 
  - Distributed tracing (Jaeger, Zipkin)
  - Rastreamento de requisições

## 📄 Licença

Este projeto é público e está disponível para fins de avaliação técnica.

## 👤 Autor

**Samuel Alves Moutinho**

- 📧 Email: samuca.moutinho@gmail.com
- 🔗 GitHub: [@samoutinho](https://github.com/samoutinho)

Desenvolvido como parte do teste técnico para Thera Consulting.
