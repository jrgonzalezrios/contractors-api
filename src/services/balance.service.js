
    //const { Profile } = app.get('models')

    async function updateProfile (profile) {
        const clientUpdated = await profile.save()
        return clientUpdated
    }
    module.exports =  {
        updateProfile
    }