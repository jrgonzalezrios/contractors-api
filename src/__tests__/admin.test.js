const supertest = require('supertest')
const serverTest = require('../utils/server')

//const balanceService = require('../services/balance.service')
const app = serverTest.startServer()


describe('Admin', () => {
    it('Should get best profession', async () => {
        const { statusCode, body } = await supertest(app)
          .get("/admin/best-profession")
        expect(body).toEqual(
            expect.objectContaining({ profession: 'Programmer', total: 2683 })
        )
    })

    it('Should get best clients', async () => {
        const { statusCode, body } = await supertest(app)
          .get("/admin/best-clients")
          console.log(body)
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({"fullName": "Ash Kethcum", "id": 4, "paid": 2020})
            ])
        )
    })
})