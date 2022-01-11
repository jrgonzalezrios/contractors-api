const { QueryTypes } = require('sequelize');
exports.getBestProfession = async (req, res) => {
    const {start, end} = req.query;
    const sequelize = req.app.get('sequelize')

    const startDate = start
    const endDate = end
    let query = `select p.profession , sum(j2.price) as total from Profiles p
    inner join Contracts c2 on c2.ContractorId = p.id
    inner join Jobs j2 on j2.ContractId =c2.id 
    where p.type = 'contractor'
    and j2.paid is not null `
    // Adding date if present
    const options = {
        type: QueryTypes.SELECT,
    }
    
    if(startDate && endDate) {
        query += ` and j2.paymentDate BETWEEN :start_date and :end_date`
        options.replacements = { start_date: startDate, end_date: endDate}
    }
    query += ` GROUP by p.profession 
    order by total desc
    LIMIT 1`
    console.log(query)
    const resp = {}
    const result = await sequelize.query(query, options)
    
    if(result.length == 0){
        resp.message = 'No information available'
        return res.status(400).json(resp)
    }
    return res.json(result[0])
      
}

exports.getBestClients = async (req, res) => {
    const {start, end, limit} = req.query;
    const sequelize = req.app.get('sequelize')

    const startDate = start
    const endDate = end
    const queryLimit = limit
    let query = `Select p.id, p.firstName || ' ' || p.lastName as fullName , sum(j2.price) as paid from Profiles p
    inner join Contracts c2 on c2.ClientId = p.id
    inner join Jobs j2 on j2.ContractId =c2.id 
    where p.type = 'client'
    and j2.paid = 1 `
    // Adding date if present
    const options = {
        type: QueryTypes.SELECT,
    }
    
    if(startDate && endDate) {
        query += ` and j2.paymentDate BETWEEN :start_date and :end_date`
        options.replacements = { start_date: startDate, end_date: endDate}
    }
    query += ` GROUP by p.profession 
    order by paid desc`
    if(queryLimit) {
        query += ` LIMIT :limit`
        if(!options.replacements) {
            options.replacements = {}
        }
        options.replacements.limit = queryLimit
    } else {
        query += ` LIMIT 2`
    }
    console.log(query)
    const resp = {}
    const result = await sequelize.query(query, options)
    
    if(result.length == 0){
        resp.message = 'No information available'
        return res.status(400).json(resp)
    }
    return res.json(result)
      
}