const express = require('express')

const server = express()

server.use(express.json())

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Diego", "email": "diego@rocketseat.com.br" }

// CRUD - Create, Read, Update, Delete

const projects = []
var contador = 0

/**
 * Middleware Global
 */
server.use((req, res, next) => {
  contador+=1
  console.log(`Contagem de requisições: ${contador} `)
  return next()
  
})

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExist(req, res, next) {
  const { id } = req.params
  const project = projects.find(p => p.id == id)

  if (!project) {
    return res.status(400).json({ error: 'Projeto não encontrado!' });
  }

  return next()
}

/**
 * Retorna todos os projetos
 */
server.get('/projects', (req, res) => {
  return res.json(projects)
})

/**
 * Route params: id
 * retorna um projeto com base no id
 */
server.get('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params

  const projectIndex = projects.findIndex(p => p.id == id )

  res.json(projects[projectIndex])
})

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body

  const project = {
    id,
    title,
    tasks: []
  }
  
  projects.push(project)

  return res.json(project)

})

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id == id)
   
  project.title = title

  return res.json(project)
})

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete('/projects/:id', checkProjectExist, (req,res) => {
  const { id } = req.params

  const projectIndex = projects.findIndex(p => p.id == id )

  projects.splice(projectIndex, 1)

  return res.send()
})

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id; 
 */
server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
  const { id } = req.params
  const { title } = req.body
  
  const project = projects.find(p => p.id == id)

  project.tasks.push(title)

  return res.json(project)
})

server.listen(3000)