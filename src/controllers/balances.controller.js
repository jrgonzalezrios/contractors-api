const { Op } = require("sequelize");
const balanceService = require('../services/balance.service')
exports.deposit = async (req, res) => {
    const { Profile, Contract, Job } = req.app.get('models')
    const { userId } = req.params
    const { money } = req.body
    let resp = {}

    if (!money || money <= 0) {
        resp.message = 'Invalid deposit'
        return res.status(400).json(resp)
    }

    const client = await Profile.findOne({
        where: {
            id: userId, type: 'client'
        },
        include:{
            model: Contract,
            as: 'Client',
            where:{
                ClientId: userId,
            },
            include: {
                model: Job,
            }
        }
    }
    )

    if (!client) {
        resp.message = 'Invalid client'
        return res.status(400).json(resp)
    }
    const contracts = client.Client
    const total = contracts.map(contract => {
    const pendigJob = contract.Jobs.filter(job => {
        return job.paid == null
    })
        return  pendigJob.reduce((accum,item) => accum + item.price, 0)
    }).reduce((previousValue, currentValue) => previousValue + currentValue)

    // Check 25% of total unpaid jobs is less than money
    const totalPercent = total * 0.25
    
    if(money >= totalPercent) {
        resp.message = 'Invalid amount, is greater than 25% of unpaid jobs'
        return res.status(400).json(resp)
    }
    // Update client balance
    client.balance += money
    const clientUpdated = await balanceService.updateProfile(client)

    if(!clientUpdated){
        resp.message = 'Internal Error, Balance was not updated'
        return res.status(400).json(resp)
    }
    resp.message = `Client's Balance was succesfuly updated, Client Balance: ${client.balance}` 
    return res.json(resp)
}