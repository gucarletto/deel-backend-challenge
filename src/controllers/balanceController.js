const { Op } = require('sequelize');

async function makeDeposit(req) {
  const { Job, Contract, Profile } = req.app.get('models')
  const { userId } = req.params
  const { amount } = req.body

  const sumOfJobsToPay = await Job.sum(
    'price',
    {
      where : {
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
            'ClientId': userId,
            status: ['new', 'in_progress']
          }
        }
      ]
    }
  )

  let success = false;
  const client = await Profile.findOne(
    {
      where: {
        id: userId
      }
    }
  )

  if(amount < (sumOfJobsToPay * 0.25)) {
    const t = await req.app.get('sequelize').transaction()
    try {

      client.balance += Number(amount)
      await client.save()

      await t.commit()
      success = true;
    } catch (err) {
      await t.rollback()
    }
  }

  return success;
}

module.exports = { makeDeposit };