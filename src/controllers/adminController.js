async function getBestProfession(req) {
  const { start, end } = req.query
  const sequelize = req.app.get('sequelize')
  const profession = await sequelize.query(
    `select profession, sum(price) as value_received
       from profiles
       join contracts
         on contracts.contractorid = profiles.id
       join jobs
         on jobs.contractid = contracts.id
      where jobs.paid = 1
        and profiles.type = 'contractor'
        and jobs.paymentDate between ? and ?
   group by profession
   order by value_received desc
      limit 1`
    , {
      replacements: [start, end],
      type: sequelize.QueryTypes.SELECT
    }
  )
  return profession[0];
}

async function getBestClients(req) {
  const { start, end, limit } = req.query
  const queryLimit = limit || 2;
  const sequelize = req.app.get('sequelize')
  const profession = await sequelize.query(
    `select profiles.id, firstName, lastName, sum(price) as value_paid
       from profiles
       join contracts
         on contracts.clientid = profiles.id
       join jobs
         on jobs.contractid = contracts.id
      where jobs.paid = 1
        and profiles.type = 'client'
        and jobs.paymentDate between ? and ?
   group by profiles.id, firstName, lastName
   order by value_paid desc
      limit ?`
    , {
      replacements: [start, end, queryLimit],
      type: sequelize.QueryTypes.SELECT
    }
  )
  return profession;
}

module.exports = { getBestProfession, getBestClients };