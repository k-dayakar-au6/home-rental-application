const Projects = require("../model/projects")

const projectapicontrollers = {}

projectapicontrollers.addproject = function(req,res){
    const user = req.session.userId
    let project = new Projects({
        ProjectFor:req.body.ProjectFor,
        ProjectType:req.body.ProjectType,
        ProjectName:req.body.ProjectName,
        ProjectAddress:req.body.projectAddress,
        ProjectCity:req.body.ProjectCity,
        ProjectContactNo:req.body.ProjectContactNo,
        ProjectDetails:req.body.ProjectDetails,
        ProjectPriceinLakhs:req.body.ProjectPriceinLakhs,
        ProjectStatus:req.body.ProjectStatus,
        user:user
    })
    console.log(req.body.ProjectAddress)

    project.save()
    .then(function(projectobj){
        console.log(projectobj,"saved successfully")
        res.status(200).json(projectobj)
    })


}

projectapicontrollers.updateproject = function(req,res){
    const projectid = req.params.projectid
        const userid = req.session.userId
        Projects.updateOne({_id:projectid,user:userid},{$set:req.body})
            .then(function(post){
                if(post) {
                    console.log(post)
                    res.status(200).json({message:"post updated successfully"})
                }
                
            })
            .catch(function(err){
                if(err){
                    console.log(err)
                    res.status(400).json({message:"post not found"})

                }
            })
}
projectapicontrollers.deleteproject = function(req,res){
    const projectid = req.params.projectid
    const userid = req.params.userid
    Projects.deleteOne({_id:projectid,user:userid})
    .then(function(post){
        if(!post){
            res.status(404).json({message:"post not found"})
        }
    })
    .catch(function(err){
        console.log(err)
        res.status(400).json({message:"internal server error"})
    })
}

projectapicontrollers.getallprojects = function(req,res){
    Projects.find({})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        res.status(500).json(err.message)
    })
}


projectapicontrollers.getdatabyresorcom = function(req,res){
    const projectfor = req.params.projecttype

    Projects.find({ProjectFor:projectfor})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json(err.message)
    })

}

projectapicontrollers.getdatabycity = function(req,res){
    const projectcity = req.params.projectcity
    Projects.find({ProjectCity:projectcity})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        res.status(500).json(err.message)
        
    })
}

projectapicontrollers.getdatabystatus = function(req,res){
    const projectstatus = req.params.projectstatus
    Projects.find({ProjectStatus:projectstatus})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        res.status(500).json(err.message)
    })
}

projectapicontrollers.pagination = async function(req,res){
    const page =   parseInt(req.query.page)
    const limit = parseInt(req.query.limit)


    const startindex = (page - 1) * limit
    const endindex = page * limit

    const results = {}

    if(endindex < await Projects.countDocuments().exec()){
        results.next = {
            page: page+1,
            limit:limit
        }
    }


    if(startindex > 0 ){
        results.previous = {
            page: page -1,
            limit:limit
        }
    }
        
    Projects.find({}).limit(limit).skip(startindex).exec()
    .then(function(result){
        if(result){
            results.results = result
            res.json(results)
        }
    })
    .catch(function(err){
        res.status(500).json({message:err.message})
    })
}


projectapicontrollers.searchresult = function(req,res){
    const projecttype = req.params.projecttype
    const status = req.query.status
    const status1 = status.split(',')

    Projects.find({ProjectFor:projecttype,ProjectStatus:{$in:status1}})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        res.status(500).json(err.message)
    })
}




    module.exports = projectapicontrollers