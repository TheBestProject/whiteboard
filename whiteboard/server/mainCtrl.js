module.exports = {

 //##A       GETS

    getUser: function( req, res ) {
        const db = req.app.get('db')
        db.getUserInfo( req.params.id ).then(( response )=>{
            res.status( 200 ).send( response )
        })
    },

    getGroup: (req, res) => {
        const db = req.app.get('db')
        db.getGroupInfo(req.params.id).then((response) => {
            res.status(200).send(response)
        })
    },

    getProject: (req, res) => {
        const db = req.app.get('db')
        db.getProjectInfo(req.params.id).then((response) => {
            res.status(200).send(response)
        })
    },

//##B        POSTS

    addUser: (req, res) => {
        const user = [
            auth0,
            name,
            email,
            profilepic,
        ]
        const db = req.app.get('db')
        db.addNewUser(user).then((response) => {
            res.status(200).send(response)
        })
    },

    addGroup: (req, res) => {
        const name = [
            req.body.name
        ]
        const db = req.app.get('db')
        db.addNewGroup(name).then((response) => {
            res.status(200).send(response)
        })
    },

    addProject: (req, res) => {
        const projectData = [
            req.params.groupid,
            req.body.name
        ]
        const db = req.app.get('db')
        db.addNewProject(projectData).then((response) => {
            res.status(200)
        })
    }
}