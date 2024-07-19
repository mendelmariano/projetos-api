# ommc-invest-api

API PARA CADASTRO DE GASTOS MENSAIS

## Instruções de instalação

- Abra o terminal do seu computador, certifique-se que tem o Node instalado
- Execute o 'npm install' para instalar a aplicação
- Crie um banco de dados no postgres com o nome de projetos
- Crie o arquivo .env na raiz do projeto com as seguintes variáveis:

# Database Configuration
DB_PORT=5432
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgresql
DB_DATABASE=projetos
DB_SSL=false
PORT=3333


- Execute o comando npx sequelize db:migrate
- Execute o comando npx sequelize db:seed:all
- Execute a aplicação com o comando 'npm start'
