module.exports = {
    
    // NAVIGATION
    // ##A  GETS 
    // ##B  POSTS 
    // ##C  PUTS 
    // ##D  DELETES


    //##A       GETS
    bgetGroups: (req, res) => {
        const db = req.app.get('db');
        console.log('userid groups', req.params.userId);
        db.bgetGroups([req.params.userId]).then(data => {
            res.status(200).send(data);
        })
    },
    bgetProjects: (req, res) => {
        const db = req.app.get('db');
        db.bgetProjects([req.params.userId]).then(data => {
            res.status(200).send(data);
        })
    },
    bgetBoards: (req, res) => {
        const db = req.app.get('db');
        db.bgetBoards([req.params.userId]).then(data => {
            res.status(200).send(data);
        })
    },
    bgetAllUsers: (req, res) => {
        const db = req.app.get('db');
        db.bgetAllUsers().then(data => {
            res.status(200).send(data);
        })
    },


    getUser: ( req, res, next ) => {
        const db = req.app.get('db')
        db.getUserInfo( req.params.id ).then(( response )=>{
            res.status( 200 ).send( response[0] )
        })
    },

    getAllUser: ( req, res, next ) => {
        const db = req.app.get('db')
        db.getAllUserInfo( req.params.id ).then(( response ) => {
            res.status( 200 ).send( response )
        })
    },

    getInitialData: ( req, res, next ) => {
        const db = req.app.get('db')
        db.getInitialData( req.params.id ).then(( response ) => {
            res.status( 200 ).send( response )
        })
    },

    getGroup: ( req, res, next ) => {
        const db = req.app.get('db')
        db.getGroupInfo(req.params.id).then((response) => {
            res.status(200).send(response)
        })
    },

    getProject: ( req, res, next ) => {
        const db = req.app.get('db')
        db.getProjectInfo(req.params.id).then((response) => {
            res.status(200).send(response)
        })
    },
    
    getGroupMembers: ( req, res, next ) => {
        const db = req.app.get('db')
        db.getGroupMembers(req.params.id).then((response) => {
            res.status(200).send(response)
        })
    },

    getProjectMembers: ( req, res, next ) => {
        const db = req.app.get('db')
        db.getProjectMembers(req.params.id).then((response) => {
            res.status(200).send(response)
        })
    },

    getBoard:(req,res,next) => {
        const db = req.app.get('db');
        db.getBoard(req.params.id).then((response)=>{
            res.status(200).send(response);
        })
    },

    //##B        POSTS

    addUser: ( req, res, next ) => {
        const userData = [
            auth0,
            name,
            email,
            profilepic,
        ]
        const db = req.app.get('db')
        db.addNewUser(userData).then((response) => {
            res.status(200).send(response)
        })
    },

    addGroup: ( req, res, next ) => {
        console.log('add a group');
        const groupData = [
            req.body.name
        ]
        const db = req.app.get('db')
        db.addNewGroup(groupData).then((response) => {
            res.status(200).send(response[0])
        })
    },
    baddGroupMember: (req, res) => {
        console.log('add a group member')
        const db = req.app.get('db');
        db.addGroupMember([req.params.groupid, req.body.member.id]).then(data => {
            res.status(200).send('success')
        })
    },

    addProject: ( req, res, next ) => {
        console.log('add a project')
        const projectData = [
            req.params.id,
            req.body.name
        ]
        const db = req.app.get('db')
        db.addNewProject(projectData).then((response) => {
            res.status(200).send(response[0])
        })
    },
    baddProjectMember: (req, res) => {
        console.log('add a project member');
        const db = req.app.get('db');
        db.addProjectMember([req.params.projectid, req.body.member.id]).then(data => {
            res.status(200).send('success');
        })
    },

    addWhiteboard: ( req, res, next ) => {
        const db = req.app.get('db')
        let name = req.body.name;
        let id = req.params.id;
        let pixel = req.body.pixel
        pixel = JSON.stringify(pixel);
        db.addNewWhiteboard([name, id, pixel]).then((response) => {
            res.status(200).send(response)
        })
    },
    // PLACEHOLDER
    // updateUser: ( req, res, next ) => {
    //     const userData = [
    //         auth0,
    //         name,
    //         email,
    //         profilepic,
    //     ]
    //     const db = req.app.get('db')
    //     db.addNewUser(userData).then((response) => {
    //         res.status(200).send(response)
    //     })
    // },
    
    //##C      PUTS
    // bupdateUser: (req, res) => {
    //     const db = req.app.get('db');
    //     const userInfo = [
    //         req.body.username
    //     ]
    // }

    bupdateGroup: (req, res) => {
        const db = req.app.get('db');
        console.log('I am updating the group');
        db.updateGroupData([req.body.name, req.params.groupid]).then(data => {
            count = req.body.members.length - 1;
            db.bdeleteGroupMembers([req.params.groupid]).then(data => {
                req.body.members.map(member => {
                    db.addGroupMember([req.params.groupid, member.id]).then(data2 => {
                        if (count === 0) {
                            res.status(200).send('success');
                        }
                        count--;
                    })
                });
            });
        })
    },
    updateGroup: ( req, res, next ) => {
        const db = req.app.get('db')
        const groupUpdateData = [
            req.body.name,
            req.params.id
        ]
        db.updateGroupData(groupUpdateData).then((response) => {
            res.status(200).send(response)
        })
    },

    bupdateProject: (req, res) => {
        const db = req.app.get('db');
        console.log('I am updating the project');
        db.updateProjectData([req.body.name, req.params.projectid]).then(data => {
            count = req.body.members.length - 1;
            db.bdeleteProjectMembers([req.params.projectid]).then(data => {
                req.body.members.map(member => {
                    db.addProjectMember([req.params.projectid, member.id]).then(data2 => {
                        if (count === 0) {
                            res.status(200).send('success');
                        }
                        count--;
                    })
                });
            });
        })
    },
    updateProject: ( req, res, next ) => {
        const db = req.app.get('db')
        const projectUpdateData = [
            req.body.name,
            req.params.id
        ]
        db.updateProjectData(projectUpdateData).then((response) => {
            res.status(200).send(response)
        })
    },

    updateWhiteboard: ( req, res, next ) => {
        const db = req.app.get('db')
        const whiteboardUpdateData = [
            req.body.name,
            req.params.id
        ]
        db.updateWhiteboard(whiteboardUpdateData).then((response) => {
            res.status(200).send(response)
        })
    },

    updateWhiteboardData: ( req, res, next ) => {
        const db = req.app.get('db')
        
        const canvasData = [
            req.body.canvas,
            req.params.id
            ]

        db.updateWhiteboardData(canvasData).then((response) => {
              res.status(200).send(response)
        })
    },

        //##D       DELETES
     
     deleteProject: ( req, res, next ) => {
         const db = req.app.get('db')

         db.deleteProject(req.params.id).then((response) => {
             res.status(200).send(response)
         })
     },
     
     deleteGroup: ( req, res, next ) => {
         const db = req.app.get('db')

         db.deleteGroup(req.params.id).then((response) => {
             res.status(200).send(response)
         })
     },

     deleteWhiteboard: ( req, res, next ) => {
         const db = req.app.get('db')

         db.deleteWhiteboard(req.params.id).then((response) => {
             res.status(200).send(response)
         })
     }

}