const pool = require('../../src/db/mysql')
const promisePool = pool.promise()

const data = {
    inventoryId: 1,
    inventoryName: 'Dolo-650',
    inventoryCategory: 'medicine',
    expiryTime: '2022-07-08 00:00:00',
    quantity: 50,
    manufacturingTime: '2021-07-08 00:00:00'
}

const file = {
    filename: ''
}

const setupDatabase = async () => {
    await promisePool.execute("DELETE FROM `inventory`")
    await promisePool.execute("INSERT INTO `inventory`(`inventory_id`, `inventory_name`, `inventory_category`, `expiry_time`, `inventory_quantity`, `manufacturing_time`, `inventory_image`, `inventory_user_id`) VALUES (?,?,?,?,?,?,?,?)", [data.inventoryId, data.inventoryName, data.inventoryCategory, data.expiryTime, data.quantity, data.manufacturingTime, file.filename, 0])
}


module.exports = {
    data,
    file,
    setupDatabase
}