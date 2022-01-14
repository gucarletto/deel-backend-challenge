const { Router } = require("express");
const { getProfile } = require('../middleware/getProfile')
const { getContractById, getContracts } = require('../controllers/contractsController')
const { getJobsUnpaid, payJob } = require('../controllers/jobsController')
const { makeDeposit } = require('../controllers/balanceController')
const { getBestProfession, getBestClients } = require('../controllers/adminController')

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

/**
 * @returns a list of all unpaid jobs
 */
routes.get('/jobs/unpaid', getProfile, async (req, res) => {
  const jobs = await getJobsUnpaid(req)
  res.json(jobs)
})

/**
 * @returnsif the payment was successful
 */
routes.post('/jobs/:id/pay', getProfile, async (req, res) => {
  const job = await payJob(req)
  if(!!job) {
    res.json(job)
  } else {
    res.status(500).json("Payment failed")
  }
})

/**
 * @returns if the deposit was successful
 */
routes.post('/balances/deposit/:userId', getProfile, async (req, res) => {
  const success = await makeDeposit(req)
  res.json(success)
})

/**
 * @returns the profession that earned the most money in a time range
 */
routes.get('/admin/best-profession', getProfile, async (req, res) => {
  const bestProfession = await getBestProfession(req)
  res.json(bestProfession)
})

/**
 * @returns the clients that paid the most money in a time range
 */
routes.get('/admin/best-clients', getProfile, async (req, res) => {
  const clients = await getBestClients(req)
  res.json(clients)
})

module.exports = { routes };