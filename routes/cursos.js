const express = require('express')
const router = express.Router()
const { Curso, Aluno } = require('../models')

// Listar todos os cursos
router.get('/', async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: [
        {
          model: Aluno,
          as: 'Alunos',
          through: { attributes: [] },
        },
      ],
    })
    res.render('cursos/index', { cursos })
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao buscar cursos')
  }
})

// Formulário para criar novo curso
router.get('/add', (req, res) => {
  res.render('cursos/add')
})

// Criar novo curso
router.post('/add', async (req, res) => {
  try {
    const { nome, carga_horaria, descricao } = req.body

    // Validação simples
    if (!nome || !carga_horaria) {
      return res.render('cursos/add', {
        error: 'Por favor, preencha todos os campos obrigatórios.',
      })
    }

    await Curso.create({ nome, carga_horaria, descricao })
    res.redirect('/cursos')
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao criar curso')
  }
})

// Mostrar detalhes do curso
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id, {
      include: [
        {
          model: Aluno,
          as: 'Alunos',
          through: { attributes: [] },
        },
      ],
    })

    const alunos = await Aluno.findAll()

    if (!curso) {
      return res.status(404).send('Curso não encontrado')
    }

    res.render('cursos/show', { curso, alunos })
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao buscar curso')
  }
})

// Formulário para editar curso
router.get('/edit/:id', async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id)

    if (!curso) {
      return res.status(404).send('Curso não encontrado')
    }

    res.render('cursos/edit', { curso })
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao carregar formulário')
  }
})

// Atualizar curso
router.post('/edit/:id', async (req, res) => {
  try {
    const { nome, carga_horaria, descricao } = req.body

    // Validação simples
    if (!nome || !carga_horaria) {
      return res.render('cursos/edit', {
        error: 'Por favor, preencha todos os campos obrigatórios.',
        curso: req.body,
      })
    }

    await Curso.update(
      { nome, carga_horaria, descricao },
      {
        where: { id: req.params.id },
      },
    )
    res.redirect('/cursos')
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao atualizar curso')
  }
})

// Adicionar aluno ao curso
router.post('/:id/add-aluno', async (req, res) => {
  try {
    const { aluno_id } = req.body

    const curso = await Curso.findByPk(req.params.id)
    const aluno = await Aluno.findByPk(aluno_id)

    if (!aluno) {
      return res.status(404).send('Aluno não encontrado')
    }

    await curso.addAlunos(aluno_id)
    res.redirect(`/cursos/${req.params.id}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao adicionar aluno')
  }
})

// Remover aluno do curso
router.post('/:id/remove-aluno/:alunoId', async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id)
    await curso.removeAlunos(req.params.alunoId)
    res.redirect(`/cursos/${req.params.id}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao remover aluno')
  }
})

// Deletar curso
router.delete('/delete/:id', async (req, res) => {
  try {
    await Curso.destroy({
      where: { id: req.params.id },
    })
    res.redirect('/cursos')
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao deletar curso')
  }
})

module.exports = router
