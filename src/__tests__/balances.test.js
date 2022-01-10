const supertest = require('supertest')
const serverTest = require('../utils/server')

const balanceService = require('../services/balance.service')
const app = serverTest.startServer()

const { Profile } = app.get('models')
const fixture = require('./fixtures/balance.json')


describe('Balance', () => {
    it('Should deposit balance', async () => {
        const balanceInput = {
            money: 100
        }
        //console.log(app.locals.settings.sequelize.models)
        const bcMock = jest.spyOn(Profile, 'findOne').mockReturnValueOnce(fixture.validClient)
        const save = jest.spyOn(balanceService, 'updateProfile').mockReturnValueOnce(jest.fn())
        const { statusCode, body } = await supertest(app)
          .post("/balances/deposit/1")
          .send(balanceInput);
        expect(body.message).toEqual(`Client's Balance was succesfuly updated, Client Balance: 1250`)
    })

    it('Should Not deposit balance', async () => {
        const balanceInput = {
            money: 500
        }
        //console.log(app.locals.settings.sequelize.models)
        const bcMock = jest.spyOn(Profile, 'findOne').mockReturnValueOnce(fixture.validClient)
        const save = jest.spyOn(balanceService, 'updateProfile').mockReturnValueOnce(jest.fn())
        const { statusCode, body } = await supertest(app)
          .post("/balances/deposit/1")
          .send(balanceInput);
        expect(body.message).toEqual(`Invalid amount, is greater than 25% of unpaid jobs`)
    })
})