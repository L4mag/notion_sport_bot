const sqlite3 = require('sqlite3').verbose()

const dbConnect = (filePath = './db/notion.db') => {
  return new sqlite3.Database(filePath, (err) => {
    if (err) {
      return console.error(err.message)
    }
  })
}

module.exports = dbConnect
