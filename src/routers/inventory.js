const express = require('express')
const multer = require('multer')
const router = new express.Router()
const logger = require('../logger/logger')
const { check, insertQuery, searchQuery, updateQuery, deleteQuery } = require('../models/inventory')
const validate = require('../middleware/validate')


// For storing the image with multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let extension = file.originalname.split(".").pop()
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
    }
})


//For storing the image with multer
const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('invalid file type'))
        }
        cb(undefined, true)
    }
})



// insert data router
router.post('/inventory', upload.single('uploadedFile'), async (req, res) => {
    try {
        logger.info('Insert data route will execute here!!')
        const valid = await check(req.body)
        if (!req.file.filename) {
            logger.error('invalid data!!!')
            return res.status(400).send({ error: 'Improper data.', message: 'Filename must required', ok: false })
        }
        logger.info('Chechking Valid Data : ', valid)
        if (valid !== true) {
            logger.error('Invalid data!!.')
            return res.status(400).send({ error: 'Improper data.', message: valid, ok: false })
        }

        logger.info('Sending req.body and req.file in insertQuery function')
        const rows = await insertQuery(req.body, req.file)
        // console.log("rows in router: ", rows)
        logger.info('Response from insertQuery function in router file: ' + rows)
        logger.info('Sending response from router using send')
        res.status(201).send(rows)
    } catch (error) {
        logger.error('error in insert router: ', error)
        res.status(500).send({ error: error.message, ok: false })
    }


})


//Search Router 
router.get('/inventory/:search', async (req, res) => {
    try {
        logger.info('Searching data Route starts...')
        const search = req.params.search
        let timezone = ''
        if (!req.query.timezone) {
            timezone = 'America/Chicago'
        } else {
            timezone = req.query.timezone
        }
        logger.info('Timezone in search data route: ', timezone)
        logger.info('Sending search and timezone in searchQuery function')
        const rows = await searchQuery(search, timezone)
        logger.info('Fetching Rows from the Response: ' + rows)
        logger.info('Sending response from router using send')
        res.send(rows)
    } catch (error) {
        logger.error('Error in search Route=====>>>>.: ', error)
        res.status(500).send({ error: error.message, ok: false })
    }
})


//Update Inventory Route
router.patch('/inventory/:id', async (req, res) => {
    try {
        logger.info('Update Data Router Starts here...')
        const id = req.params.id
        const quantity = req.body.quantity
        if (!quantity || !id) {
            logger.error('Invalid data')
            return res.status(400).send({ error: 'quantity or id not specified!', ok: false })
        }
        logger.info('Sending id, req.body and req.file in updateQuery function')
        const rows = await updateQuery(id, quantity)
        logger.info('Response from updateQuery function in router file: ' + rows)
        logger.info('sending response from router using send')
        res.status(200).send(rows)
    } catch (error) {
        logger.error('Error in Update router: ', error)
        res.status(500).send({ error: error.message, error: error, ok: false })
    }


})



//delete data router
router.delete('/inventory/:search', async (req, res) => {
    try {
        logger.info('Delete data route start here....')

        const search = req.params.search

        logger.info('Sending search parameters into the deleteQuery function')
        const rows = await deleteQuery(search)
        logger.info('Response from deleteQuery function in router file: ' + rows)
        logger.info('Sending response from router using send')
        res.send(rows)


    } catch (error) {
        logger.error('error in delete router: ', error)
        res.status(500).send({ error: error.message, ok: false })
    }
})


module.exports = router
