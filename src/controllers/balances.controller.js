const { Op } = require("sequelize");

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
    const totalPending = 0
    const pendingValues =  client.Client.map(contracts =>{
        //return contracts
        const  pendingJob = contracts.Jobs.filter(job => {
            return job.paid == null
        })
        if(pendingJob.length > 0){
          return pendingJob[0]
        }
        
    })

    res.json(pendingValues)
}