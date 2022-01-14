const { Op } = require('sequelize');

async function getJobsUnpaid(req) {
  const { Job, Contract } = req.app.get('models')

  const jobs = await Job.findAll(
    {
      where: {
        [Op.or]: [
          {
            'paid': {
              [Op.is]: null
            }
          },
          {
            'paid': false
          },
        ]
      },
      include: [
        {
          model: Contract,
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
          }
        }
      ]
    }
  )
  return jobs;
}

async function payJob(req) {
  const { Job, Contract, Profile } = req.app.get('models')
  const { id } = req.params

  const job = await Job.findOne(
    {
      where : {
        id,
        [Op.or]: [
          {
            'paid': {
              [Op.is]: null
            }
          },
          {
            'paid': false
          },
        ]
      },
      include: [
        {
          model: Contract,
          where: {
           'ClientId': req.profile.id,
            status: ['new', 'in_progress']
          }
        }
      ]
    }
  )
  if(!!job) {
    const { ClientId, ContractorId } = job.Contract.dataValues
    const client = await Profile.findOne(
      {
        where: {
          id: ClientId
        }
      }
    )
    const contractor = await Profile.findOne(
      {
        where: {
          id: ContractorId
        }
      }
    )
    if(client.balance >= job.price) {
      const t = await req.app.get('sequelize').transaction()
      try {

        job.paid = true
        job.paymentDate = new Date()
        await job.save()

        client.balance -= job.price
        await client.save()

        contractor.balance += Number(job.price)
        await contractor.save()

        await t.commit()
      } catch (err) {
        await t.rollback()
      }
    } else {
      return false;
    }
  }

  return job;
}

module.exports = { getJobsUnpaid, payJob };