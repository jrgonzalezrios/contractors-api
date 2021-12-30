const { Op } = require("sequelize");

exports.findById = async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contract = await Contract.findOne({where: {id}})
    if(!contract) return res.status(404).end()
    res.json(contract)
}

exports.getAll = async (req, res) => {
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
}