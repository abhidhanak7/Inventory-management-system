const request = require('supertest')
const app = require('../src/app')
const { check, insertQuery, searchQuery, updateQuery, deleteQuery } = require('../src/models/inventory')
const { data, file, setupDatabase } = require('./fixtures/db')
const pool = require('../src/db/mysql')
const promisePool = pool.promise()


setupDatabase()

test('Should insert data in inventory', async () => {
    const response = await request(app)
        .post('/insertinventory')
        .attach('uploaded_file', 'tests/fixtures/Screenshot.png')
        .field(data)
        .expect(201)
})

test('Should search data in inventory', async () => {
    const response = await request(app)
        .get(`/searchinventory/${data.inventoryName}`)
        .expect(200)

    const rows = await searchQuery(data.inventoryName, 'America/Chicago')
    expect(rows).not.toBeNull()

})

test('Should update data in inventory', async () => {
    const response = await request(app)
        .put(`/updateinventory/${data.inventoryId}`)
        .attach('uploaded_file', 'tests/fixtures/Screenshot.png')
        .field(data)
        .expect(200)
})

test('Should delete data in inventory', async () => {
    const response = await request(app)
        .delete(`/deleteinventory/${data.inventoryName}`)
        .expect(200)
})