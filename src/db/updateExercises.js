const dbInsert = require('./util/dbInsert')

const insertExerciseSets = (setName) => {
  dbInsert(new Map([['name', setName]]), 'exercise_set')
}

module.exports = insertExerciseSets
