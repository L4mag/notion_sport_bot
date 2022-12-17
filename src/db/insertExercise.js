const dbInsert = require('./util/dbInsert')

const insertExercise = (
    exercise,
    lastUpdateDatetime = new Date()
) => {
    return dbInsert(
        'exercise',
        new Map([
            ['name', exercise],
            ['last_update_datetime', lastUpdateDatetime],
        ])
    )
}

module.exports = insertExercise