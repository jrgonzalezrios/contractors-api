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
module.exports = app;
