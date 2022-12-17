const dbConnect = require('./util/dbConnect')

const setTodaysSet = async () => {
  const db = dbConnect()

  const selectTodaysSetSql = `SELECT * FROM exercise_set WHERE name <> 'Daily'\n`

  db.serialize(() => {
    db.all(selectTodaysSetSql, (err, rows) => {
      if (err) {
        return console.error(err.message)
      }

      const ids = rows.map((r) => r.id)

      const forToday =
        rows.filter((r) => r.for_today === 'true')
          .length === 0
          ? []
          : rows.filter((r) => r.for_today === 'true')[0].id

      const forTomorrow =
        forToday.length === 0
          ? rows[0].id
          : ids[(ids.indexOf(forToday) + 1) % ids.length]

      // console.log(
      //   'ids[(ids.indexOf(forToday[0].id) + 1) % ids.length] ',
      //   forToday.length === 0
      //     ? rows[0].id
      //     : ids[(ids.indexOf(forToday) + 1) % ids.length]
      // )

      db.run(
        `UPDATE exercise_set\n` +
          `SET for_today = 'true'\n` +
          `WHERE id = ${forTomorrow}\n` +
          `AND name <> 'Daily'`,
        (err) => {
          if (err) {
            return console.error(err.message)
          }

          db.run(
            `UPDATE exercise_set\n` +
              `SET for_today = 'false'\n` +
              `WHERE id != ${forTomorrow}\n`,
            (err) => {
              if (err) {
                return console.error(err.message)
              }
            }
          )
        }
      )
    })
  })
}

module.exports = setTodaysSet
