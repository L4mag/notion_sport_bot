const dbConnect = require('./dbConnect')

const dbInsert = (table, data) => {
  const db = dbConnect()

  const fieldsTemp = String([...data.keys()])
  const valuesTemp = String(
    [...data.values()].map((d) => `\'${d}\'`)
  )

  db.serialize(() => {
    // console.log(
    //   `INSERT INTO ${table} (${fieldsTemp})
    //    VALUES(${valuesTemp})`
    // )
    db.run(
      `INSERT INTO ${table} (${fieldsTemp})
        VALUES(${valuesTemp})`,
      (err) => {
        if (err) {
          return console.error(err.message)
        }

        console.log(
          `data has been inserted into ${table} table.`
        )
      }
    )
  })
  db.close()
}

module.exports = dbInsert
