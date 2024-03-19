# Gabinete Digital API

## Descrição

A API do Gabinete Digital é responsável por fornecer acesso aos recursos e funcionalidades da aplicação Gabinete Digital. Esta API permite gerenciar usuários, níveis de acesso e outras funcionalidades relacionadas ao gabinete digital.

## Instalação

Para instalar a API do Gabinete Digital, siga as etapas abaixo:

1. Clone o repositório do GitHub ou faça o download do código-fonte.
2. Navegue até o diretório raiz do projeto.
3. Execute o comando `npm install` para instalar as dependências do projeto.
4. Após a conclusão da instalação, execute `npm start` para iniciar o servidor da API.

Certifique-se de configurar corretamente as variáveis de ambiente conforme necessário antes de iniciar o servidor.


## Configuração do Banco de Dados

Antes de iniciar o servidor da API, é necessário configurar um banco de dados MySQL. Adicione as seguintes variáveis de ambiente ao arquivo `.env` e substitua os valores pelos detalhes do seu banco de dados:

```dotenv
DB_HOST=host
DB_USER=user
DB_PASS=password
DB=database
```

## Configuração do usuário master

Antes de iniciar o servidor da API, é necessário configurar um usuário master do sistema. Esse usuário é usado para instalação e configuração da aplicação. Adicione as seguintes variáveis de ambiente ao arquivo `.env` e substitua os valores pelos detalhes do usuário master:

```dotenv
MASTER_KEY=chave
MASTER_EMAIL=admin@admin
MASTER_PASS=pass
MASTER_USER=Administrator
```

## Crição das tabelas

Após iniciar o servidor, acesse a url `/api/sync` para sincronizar as tabelas do banco.

## Como Usar

Após iniciar o servidor da API, você pode acessar os endpoints fornecidos para interagir com a aplicação Gabinete Digital. Consulte a documentação da API para obter detalhes sobre os endpoints disponíveis e como utilizá-los.

## Documentação da API

A documentação da API está disponível no diretório `/api-docs` após iniciar o servidor. Você pode acessar a documentação em seu navegador para obter informações detalhadas sobre os endpoints, seus parâmetros e respostas correspondentes.

## Contribuição

Contribuições são bem-vindas! Se você encontrar algum problema ou desejar melhorar a API do Gabinete Digital, sinta-se à vontade para enviar um pull request ou abrir uma issue no GitHub.

## Licença

Este projeto é licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).
