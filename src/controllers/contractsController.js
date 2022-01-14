const { Op } = require('sequelize');

async function getContractById(req) {
  const { Contract } = req.app.get('models')
  const { id } = req.params
  const contract = await Contract.findOne(
    {
      where: {
        id,
        [Op.or]: [
          {
            'ClientId': req.profile.id
          },
          {
            'ContractorId': req.profile.id
          }
        ]
      },
    }
  )
  return contract;
}

async function getContracts(req) {
  const { Contract } = req.app.get('models')
  const contracts = await Contract.findAll(
    {
      where: {
        [Op.or]: [
          {
            'ClientId': req.profile.id
          },
          {
            'ContractorId': req.profile.id
          }
        ],
        status: ['new', 'in_progress']
      },
    }
  )
  return contracts;
}

module.exports = { getContractById, getContracts };