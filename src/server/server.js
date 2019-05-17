import path from 'path'
import express from 'express'
import {service} from './service'
import multer from 'multer'
import Octokit from '@octokit/rest'


const octokit = new Octokit({
    userAgent: 'myApp v1.2.4.5',
    baseUrl: 'https://api.github.com',
    auth: {
        username: process.env.git_user_name,
        password: process.env.git_password
    }
})

const upload = multer({dest: 'uploads'});

//Creating express object host an api server
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')
app.use(express.static(DIST_DIR))
app.use(express.json())

//Get Api to render UI
app.get('/', (req, res) => {
    res.sendFile(HTML_FILE)
})

//Get Api to fetch all the issues bucket wise
app.get('/fetch-data', (req, res) => {
    service.fetchData(req, res, octokit);
})

//Startign the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})


