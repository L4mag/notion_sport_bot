const { Client } = require('@notionhq/client')
const fs = require('fs')
const formatDate = require('./util/formatDate')
const cron = require('node-cron')
const nodemailer = require('nodemailer')
const config = require('config')
const getNotionExercises = require('./controller/getNotionExercises')
const insertExerciseSet = require('./db/insertExerciseSet')
const initializeDb = require('./db/initializeDb')
const insertExercise = require('./db/insertExercise')
const dbSelect = require('./db/util/dbSelect')
const dbUpdate = require('./db/util/dbUpdate')
const populateLastExerciseCount = require('./db/populateLastExerciseCount')
const setTodaysSet = require('./db/setTodaysSet')
const checkExercisesUpdates = require('./db/checkExercisesUpdates')

const MAIL_USER = config.get('MailService.USER')
const MAIL_PASS = config.get('MailService.PASS')
const MAIL_RECIPIENT = config.get('MailService.RECIPIENT')

const cronScheduleTime = config.get('Cron.schedule-time')

const NOTION_KEY = config.get('Notion.NOTION_KEY')
const NOTION_DATABASE_ID = config.get(
  'Notion.NOTION_DATABASE_ID'
)
const EXERCISE_SETS_DB_ID = config.get(
  'Notion.EXERCISE_SETS_DB_ID'
)

const notion = new Client({ auth: NOTION_KEY })

initializeDb().then((r) => {
  //getting exercises and exercises sets from notion database
  getNotionExercises(notion, EXERCISE_SETS_DB_ID).then(
    (data) => {
      const maxUpdateDateNotion = new Date(
        Math.max(
          ...data.map((d) => new Date(d.lastEditedTime))
        )
      )

      data.map((exercisesData) => {
        // console.log(new Date(exercisesData.lastEditedTime))
        //inserting exercise sets to a local SQLite DB
        insertExerciseSet(exercisesData.setName)
        exercisesData.exercises.map((ex) => {
          //inserting exercises to a local SQLite DB
          checkExercisesUpdates(
            maxUpdateDateNotion,
            insertExercise,
            ex
          )
        })

        //Updating FOREIGN KEY ex_set_id for  exercises in a local SQLite DB
        //TODO: Find a better way for creating function that can update any table with any data
        dbUpdate(
          `UPDATE exercise \n` +
            `SET ex_set_id = ex_set.id\n` +
            `FROM exercise_set ex_set\n` +
            `WHERE ex_set.name like '%${exercisesData.setName}%'\n` +
            `and exercise.name in (${exercisesData.exercises.map(
              (ex) => String(`\'${ex}\'`)
            )})`
        )
      })

      populateLastExerciseCount()
      //Setting today's exercises set
      //TODO: Find a better way for creating function that can update any table with any data
      setTodaysSet().then(() => {})
    }
  )
})
