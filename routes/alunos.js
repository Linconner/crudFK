const express = require('express');
const router = express.Router();
const { Aluno, Curso } = require('../models');

// Listar todos os alunos
router.get('/', async (req, res) => {
  try {
    const alunos = await Aluno.findAll({
      include: [{
        model: Curso,
        as: 'Cursos',
        through: { attributes: [] }
      }]
    });
    res.render('alunos/index', { alunos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar alunos');
  }
});

// Formulário para criar novo aluno
router.get('/add', async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.render('alunos/add', { cursos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar formulário');
  }
});
// Criar novo aluno
router.post('/add', async (req, res) => {
  try {
    const { nome, email, idade, curso_id } = req.body;

    // Verificar se o email já está cadastrado
    const alunoExistente = await Aluno.findOne({ where: { email: email } });

    if (alunoExistente) {
      // Se o email já existe, redireciona de volta para o formulário com os dados preenchidos
      const cursos = await Curso.findAll();
      return res.render('alunos/add', { 
        nome, 
        email, 
        idade, 
        curso_id, 
        cursos,
        messageError: "Email já cadastrado" // Definindo a variável messageError
      });
    }

    // Caso contrário, insira o novo aluno no banco de dados
    const aluno = await Aluno.create({ nome, email, idade });
    
    if (curso_id) {
      await aluno.addCursos(curso_id);
    }
    
    res.redirect('/alunos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar aluno');
  }
});
// Mostrar detalhes do aluno
router.get('/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id, {
      include: [{
        model: Curso,
        as: 'Cursos',
        through: { attributes: [] }
      }]
    });
    
    const cursos = await Curso.findAll();
    
    if (!aluno) {
      return res.status(404).send('Aluno não encontrado');
    }
    
    res.render('alunos/show', { aluno, cursos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar aluno');
  }
});

// Formulário para editar aluno
router.get('/edit/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    
    if (!aluno) {
      return res.status(404).send('Aluno não encontrado');
    }
    
    res.render('alunos/edit', { aluno });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar formulário');
  }
});

// Atualizar aluno
router.put('/edit/:id', async (req, res) => {
  try {
    const { nome, email, idade } = req.body;
    await Aluno.update({ nome, email, idade }, {
      where: { id: req.params.id }
    });
    res.redirect('/alunos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar aluno');
  }
});

// Adicionar curso ao aluno
router.post('/:id/add-curso', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    await aluno.addCursos(req.body.curso_id);
    res.redirect(`/alunos/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao adicionar curso');
  }
});

// Remover curso do aluno
router.post('/:id/remove-curso/:cursoId', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    await aluno.removeCursos(req.params.cursoId);
    res.redirect(`/alunos/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao remover curso');
  }
});

// Deletar aluno
router.delete('/delete/:id', async (req, res) => {
  try {
    await Aluno.destroy({
      where: { id: req.params.id }
    });
    res.redirect('/alunos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar aluno');
  }
});

module.exports = router;