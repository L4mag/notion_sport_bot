const { Client } = require('@notionhq/client')
const config = require('config')

const cronScheduleTime = config.get('Cron.schedule-time')

const NOTION_KEY = config.get('Notion.NOTION_KEY')
const NOTION_DATABASE_ID = config.get(
  'Notion.NOTION_DATABASE_ID'
)
const LOWER_BODY_DB_ID = config.get(
  'Notion.LOWER_BODY_DB_ID'
)

const notion = new Client({ auth: NOTION_KEY })
const pi = '85fcd9271f364aaa85a12da3b4200097'

// functions that retrieves exercises sets data from Notion DB
// and if local DB's Last_edited_time is different from Notion DB it will update local data
const getNotionExercises = async (
  notionClient,
  exercisesPageId
) => {
  const rawData = await notionClient.databases.query({
    database_id: exercisesPageId,
  })

  return rawData.results.map((r) => {
    const rawExercises =
      r.properties.Exercises.multi_select.map((r) => r.name)
    const rawSetName =
      r.properties.Set_Name.title[0].plain_text
    const lastEditedTime =
      r.properties.Last_edited_time.last_edited_time

    return {
      setName: rawSetName,
      exercises: rawExercises,
      lastEditedTime: lastEditedTime,
    }
  })
}

module.exports = getNotionExercises
