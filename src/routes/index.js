module.exports = app => {
    console.log('router')
    const {getProfile} = require('../middleware/getProfile')
    const contracts = require('../controllers/contracts.controller')
    const jobs = require('../controllers/jobs.controller')
    const balances = require('../controllers/balances.controller')

    const router = require('express').Router()

    app.get('/contracts/:id',getProfile , contracts.findById)
    app.get('/contracts', getProfile , contracts.getAll)

    app.get('/jobs/unpaid', getProfile, jobs.getUnpaid)
    app.post('/jobs/:job_id/pay', getProfile, jobs.payById)

    app.post('/balances/deposit/:userId', balances.deposit)
}