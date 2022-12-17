const dbInsert = require('./utils/dbInsert')

const insertExercise = (exercise) => {
  dbInsert('exercise', new Map([['name', exercise]]))
}

module.exports = insertExercise
