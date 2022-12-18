const dbConnect = require('./dbConnect')

const dbUpdate = (sql) => {
  const db = dbConnect()

  db.serialize(() => {
    db.run(sql, (err) => {
      if (err) {
        return console.error(err.message)
      }
    })
  })
  db.close()
}

module.exports = dbUpdate
