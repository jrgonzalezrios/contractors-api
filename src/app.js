const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, Job} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
 const { Op } = require("sequelize");
app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contract = await Contract.findOne({where: {id}})
    if(!contract) return res.status(404).end()
    res.json(contract)
})

app.get('/contracts', getProfile , async (req, res) => {
    const {Contract} = req.app.get('models')
    const { id, type } = req.profile
    let query = {
        where: {
            status: {[Op.not]: 'terminated'},
            ClientId: id
        }
    }
    if (type === 'contractor') {
        delete query.where.ClientId
        query.where = {
            ContractorId: id
        }
    }
    const contracts = await Contract.findAll(query)
    if(!contracts) return res.status(404).end()
    res.json(contracts)
})

app.get('/jobs/unpaid', getProfile, async (req, res) => {
    const { Job, Contract } = req.app.get('models')
    const { id, type } = req.profile
    let contractQuery = {
        where: {
            ClientId: id,
            status: {[Op.not]: 'terminated'},
        }
    }
    if( type === 'contractor') {
        delete contractQuery.where.ClientId
        contractQuery.where = {            
            ContractorId: id
        }
    }
    let query = {
        where: {
            paymentDate: {[Op.is]: null},
        },
        include:{
            model: Contract,
            where: contractQuery.where
        }
    }
    const jobsUnpaid = await Job.findAll(query)
    if(!jobsUnpaid) return res.status(404).end()
    res.json(jobsUnpaid)
})

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    

    const { Job, Contract, Profile } = req.app.get('models')
    const { id, type, balance } = req.profile
    const {job_id} = req.params
    // Verify type of user and balance
    if (type !== 'client') {
        const errResp = {
            message: "Invalid Client"
        }
        return res.status(400).json(errResp)
    }
    if (balance <= 0) {
        const errResp = {
            message: "Insufficient funds"
        }
        return res.status(400).json(errResp)
    }
    // Deposit money move from client to contracts
    const job = await Job.findOne({ where: {
            id: job_id,
            price:{ [Op.lte]: balance },
            paid: {[Op.is]: null}
        },include:{
            model: Contract
        }
    })
    console.log(job)
    const resp = {}
    if(!job) {
        resp.message = 'Invalid Job, can not be paid or was already paid'
        return res.status(400).json(resp)
    }
    // Setting new Balance
    job.paid = 1
    job.paymentDate = new Date()
    jobUpdated = await job.save()

    // Update client balance
    const client = await Profile.findOne({where: {id: id}})
    client.balance -= job.price
    await client.save()

    // Update contractor balance
    const contractor = await Profile.findOne({where: {id: job.Contract.ContractorId}})
    contractor.balance += job.price
    await contractor.save()

    if(jobUpdated){
        // update Contractor's balance
        resp.message = `Job ${job_id} was succesfuly paid, Client Balance: ${client.balance}` 
        return res.json(resp)
    }
    

})
module.exports = app;
