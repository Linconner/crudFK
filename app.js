const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

// Inicializa o aplicativo Express
const app = express();

// Configuração do banco de dados
const db = require('./models');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Configuração do EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Arquivos estáticos
app.use(express.static('public'));

// Rotas

const indexRouter = require('./routes/index');
const alunosRouter = require('./routes/alunos');
const cursosRouter = require('./routes/cursos');
const { constants } = require('buffer');

app.use('/', indexRouter);
app.use('/alunos', alunosRouter);
app.use('/cursos', cursosRouter);

// Sincronização com o banco de dados
db.sequelize.sync({ force: false }).then(() => {
  console.log('Banco de dados sincronizado');
}).catch(err => {
  console.error('Erro ao sincronizar banco de dados:', err);
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <h1>Erro</h1>
    <p>${err.message}</p>
    ${process.env.NODE_ENV === 'development' ? `<pre>${err.stack}</pre>` : ''}
  `);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});