const http = require('http');
const express = require('express')

const port = 3000
const hostname = 'localhost'

const app = express()
const server = http.createServer(app)

const productsService = require('./services/products')

app.get('/', (req, res) => res.send('Build the API!'))

// Build Routes

//returns all products
app.get('/api/v1/products', (req, res) => {
  const sort = req.query.sort || 'id'
  const dir = req.query.dir || 'ASC'

  res.json(productsService.findAll(sort, dir))
});

app.get('/api/v1/products/search', (req, res) => {
  const key = req.query.key
  const value = req.query.value
  const sort = req.query.sort || 'id'
  const dir = req.query.dir || 'ASC'

  if (!key || !value) {
    res.status(400).json({ error: 'Invalid search query must contain key and value' })
    return
  }
  res.json(productsService.search(key, value, sort, dir))
});
//get product by id
app.get('/api/v1/products/:id', (req, res) => {
  const id = req.params.id
  const product = productsService.findOneById(id)

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' })
    return
  }
  if (!product) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(productsService.findOneById(id))
});




app.get('*', (req, res) => res.status(404).send('Page not found'))

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})