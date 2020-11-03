// load libs
const express = require('express')
const hbs = require('express-handlebars')
const mysql = require('mysql2/promise')

// import router
const r = require('./app')

// PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

// create pool
const pool = mysql.createPool({
  connectionLimit: 4,
  host: 'db4free.net',
  // host: process.env.HOST || 'localhost',
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: 'my_server88',
  // database: process.env.DB_NAME || 'leisure',
  port: process.env.DB_PORT || 3306,
  timezone: '+08:00',
})

// create instance of app
const app = express()

// set view engine
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs'
}))
app.set('view engine', 'hbs')

// create instance of router app
const router = r(pool)

// configure app
app.use(router)

// start app
const startApp = async (pool, app) => {
  try {
    const connection = await pool.getConnection()
    console.log('ping db')
    const result = await connection.ping()

    console.log(`ping result`, result)
    connection.release()
    app.listen(PORT, async () => {
      console.log('app listening on ' + PORT)
    })
  } catch (err) {
    console.error(err)
  }
}

startApp(pool, app)
