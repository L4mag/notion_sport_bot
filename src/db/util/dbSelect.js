const dbConnect = require('./dbConnect')

const dbSelect = async (table, field, data, func) => {
  const db = dbConnect()

  const sql = `SELECT * from ${table} WHERE ${field} like '%${data}%'`

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    func(rows)
  })

  db.close()
}

module.exports = dbSelect
