import path from 'path'
import express from 'express'
import {service} from './service'
import multer from 'multer'

const upload = multer({dest: 'uploads'});

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')
app.use(express.static(DIST_DIR))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE)
})
app.get('/fetch-data', (req, res) => {
    service.fetchData(req, res);
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})


