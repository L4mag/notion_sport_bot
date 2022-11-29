const {Client} = require("@notionhq/client")
const formatDate = require("./formatDate")
const fs = require('fs');
const cron = require("node-cron")
const nodemailer = require("nodemailer")
const config = require("config")

const MAIL_USER = config.get("MailService.User")
const MAIL_PASS = config.get("MailService.Pass")

const cronScheduleTime = config.get("Cron.schedule-time")

const NOTION_KEY = config.get('Notion.NOTION_KEY')
const NOTION_DATABASE_ID = config.get('Notion.NOTION_DATABASE_ID')
const LOWER_BODY_DB_ID =  config.get('Notion.LOWER_BODY_DB_ID')
const UPPER_BODY_DB_ID =  config.get('Notion.UPPER_BODY_DB_ID')

const notion = new Client({auth: NOTION_KEY})

const databaseId = NOTION_DATABASE_ID

const title = formatDate(new Date())

cron.schedule(cronScheduleTime, () => {
    console.log("--------------------------")
    addItem()
        .then(r => {
            mailService()
        })
})

const mailService = () => {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS,
        },
    })

    const mailDetails = {
        from: MAIL_USER,
        to: "gheryesss@gmail.com",
        subject: `It's time to do your workout ${title}`,
        text: `Hey buddy, check your workout for ${title}`
    }

    mailTransporter.sendMail(mailDetails, (err, data) => {
        if(err) {
            console.log("error occured", err.message)
        } else {
            console.log("-------------------")
            console.log("email sent successfully")
        }
    })
}

async function addItem() {
    const isUpperBody = await getIsUpperBody()

    const exercisesGroup = isUpperBody === 'true' ? 'Upper body' : 'Lower body'
    const exercisesDbId = exercisesGroup === 'Lower body' ? LOWER_BODY_DB_ID : UPPER_BODY_DB_ID

    console.log('isUpperBody ', isUpperBody)
    console.log('exercisesGroup ', exercisesGroup)

    notion.databases.create({
        parent: {
            page_id: databaseId,
        },
        title: [
            {
                type: 'text',
                text: {content: title, link: null},
                annotations: {
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default'
                },
                plain_text: title,
                href: null
            }
        ],
        properties: {
            Count: {id: 'CrZT', name: 'Count', type: 'rich_text', rich_text: {}},
            Exercise: {id: 'title', name: 'Exercise', type: 'title', title: {}}
        },
    })
        .then(res => {
                notion.databases.query({
                        database_id: exercisesDbId,
                        sorts: [
                            {
                                property: 'Number',
                                direction: 'ascending',
                            },
                        ]
                    }
                )
                    .then(r => {
                            let exercises = []

                            r.results.map(res => {
                                exercises.push(res.properties.Exercise.title[0].text.content)
                            })
                            const db_id = res.id
                            const promises = exercises.map(
                                ex => {
                                    notion.pages.create({
                                        parent: {
                                            database_id: db_id,
                                        },
                                        properties: {
                                            Exercise: {
                                                type: 'title',
                                                title: [{
                                                    text: {
                                                        content: ex
                                                    }
                                                }],
                                            },
                                            Count: {
                                                type: 'rich_text',
                                                rich_text: [{
                                                    text: {
                                                        content: ''
                                                    },
                                                }],
                                            },
                                        },
                                    }).then(res => {
                                        }
                                    ).catch(e => {
                                        console.log(e)
                                    })
                                })

                            Promise.all(promises)
                                .then(res => {
                                    setIsUpperBody(isUpperBody !== 'true')
                                })
                        }
                    )
            }
        )
}

//function to set muscle group for exercises
function setIsUpperBody(data) {
    console.log('setIsUpperBody start')
    fs.writeFileSync('./isUpperBody.txt', String(data))
    console.log(data)
    console.log('setIsUpperBody end')
}

//function to get muscle group for exercises
async function getIsUpperBody() {
    return fs.readFileSync('./isUpperBody.txt', 'utf8')
}

// async function getDailyReport() {
//     try {
//         // const response = await notion.pages.retrieve({page_id: databaseId})
//         const response = await notion.databases.query({database_id: 'ce1ec202813147c3a7b6affc9d566313'})
//
//         // const response = await notion.databases.retrieve({});
//         // console.log(response)
//         // console.log(response.results)
//         // response.results.map(r => {
//         //         console.log(r.properties)
//         //         // r.properties.map(title => {
//         //         //         console.log(title)
//         //         //     }
//         //         // )
//         //     }
//         // )
//         // response.results.map(r => {
//         //     // console.log(r.properties)
//         //     console.log('Exercise')
//         //     r.properties.Exercise.title.map(prop => {
//         //         console.log(prop.text.content)
//         //     })
//         //     console.log('Count')
//         //     r.properties.Count.rich_text.map(prop => {
//         //         console.log(prop.text.content)
//         //     })
//         // })
//         console.log(response)
//     } catch (error) {
//         console.error(error.body)
//     }
// }
