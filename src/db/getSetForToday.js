const dbConnect = require('./util/dbConnect')

const getSetForToday = (setId) => {
    const db = dbConnect()

    const sql = `SELECT e.* FROM exercise_set es
    JOIN exercise e ON e.ex_set_id = es.id
    WHERE es.id = es.for_today = 'true'
    AND es.name <> 'Daily'`

    db.serialize(() => {
        db.run(sql, (err) => {
            if (err) {
                return console.error(err.message)
            }
        })
    })
    db.close()
}

module.exports = getSetForToday