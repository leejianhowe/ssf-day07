// load libraries
const express = require('express')

// SQL
const SQL_FIND_TV_SHOWS = 'SELECT * from tv_shows ORDER BY name ASC limit ? offset ?'
const SQL_FIND_TV_SHOW_ID = 'SELECT * from tv_shows where tvid = ?'
const SQL_FIND_LENGTH = 'SELECT count(*) as tvShowsLength from tv_shows'

function routing(pool) {

  const router = express.Router()

  router.get('/', async (req, res) => {
    const connection = await pool.getConnection()
    const offset = parseInt(req.query.offset) || 0
    const limit = 4

    try {
      const findLength = await connection.query(SQL_FIND_LENGTH)
      const results = await connection.query(SQL_FIND_TV_SHOWS, [limit, offset])
      // console.log(results)
      // console.log(findLength)
      res.status(200).type('text/html')
      res.render('landing', {
        results: results[0],
        offsetBack: Math.max(offset - limit, 0),
        offsetNext: Math.min(offset + limit, findLength[0][0].tvShowsLength)

      })
    } catch (err) {
      console.error(err)
    } finally {
      connection.release()

    }
  })

  router.get('/result/:tvid', async (req, res) => {
    const tvid = req.params.tvid
    const connection = await pool.getConnection()
    try {
      const result = await connection.query(SQL_FIND_TV_SHOW_ID, [tvid])
      console.log(result[0][0])
      res.status(200).type('text/html')
      res.render('result', {
        result: result[0][0]
      })
    } catch (err) {
      res.status(500).type('text/html')
      res.send('not found')
      console.error(err)
    } finally {
      connection.release()
    }
  })
  return router
}

module.exports = routing
