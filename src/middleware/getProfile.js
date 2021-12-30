const { Op } = require("sequelize");

const getProfile = async (req, res, next) => {
    const { Profile, Contract } = req.app.get('models')
    
    const profile_id = req.get('profile_id')
    const profile = await Profile.findOne({where: {id: profile_id || 0}})
    const {id} = req.params
    if (id) {
        const contractsAsContractor = await Contract.findOne({
            as: 'Contractor',
            where: {
                ContractorId: profile_id,
                id: id
            }
        })
        const contractsAsClient = await Contract.findOne({
            as: 'Client',
                where: {
                    ClientId: profile_id,
                    id: id
                }
        })
        if(!contractsAsContractor && !contractsAsClient) return res.status(401).end()
        req.profile = profile
        next()
    } else {
        req.profile = profile
        next()
    }    
}
module.exports = {getProfile}