const {getProfile} = require('../getProfile')


describe('getProfile Middleare Tests', () => {
    test('Should return a Profile', done => {
        const mockGetInstance = {
            get: jest.fn().mockReturnThis()
        }
        getProfile(mockGetInstance)
        done()
    })
})