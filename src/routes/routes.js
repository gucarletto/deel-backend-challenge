const { Router } = require("express");
const { getProfile } = require('../middleware/getProfile')
const { getContractById, getContracts } = require('../controllers/contractsController')

const routes = Router();

/**
 * @returns contract by id
 */
routes.get('/contracts/:id', getProfile, async (req, res) => {
  const contract = await getContractById(req)
  if (!contract) return res.status(404).end()
  res.json(contract)
})

/**
 * @returns a list of contracts
 */
routes.get('/contracts', getProfile, async (req, res) => {
  const contracts = await getContracts(req)
  res.json(contracts)
})

module.exports = { routes };