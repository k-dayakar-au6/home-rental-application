const Post = require('../model/posts')


const  postapicontrollers = {}


postapicontrollers.posts = function(req,res){
    const user = req.session.userId
    let post = new Post({
    userId : req.session.userId,
    WhatYouAre : req.body.WhatYouAre,
    ListPropertyFor : req.body.ListPropertyFor,
    YourPropertyFor : req.body.YourPropertyFor,
    PropertyType : req.body.PropertyType,
    AccomadationFor : req.body.AccomadationFor,
    Address : req.body.Address,
    City : req.body.City,
    ProjectName : req.body.ProjectName,
    Pricing : req.body.Pricing,
    Features : req.body.Features,
    ContactNo : req.body.ContactNo,
    user:user
    })

    post.save()
    .then(function(postobj){
        console.log(postobj, "saved successfully")
        res.status(200).json({message:"your post saved successfully"})
    })
    .catch(function(err){
        console.log(err.message)
        return res.status(500).json({message:"server error"})
    })

}


postapicontrollers.updatepost = function(req,res){
        const postid = req.params.postid
        const userid = req.session.userId
        Post.updateOne({_id:postid,user:userid},{$set:req.body})
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


postapicontrollers.deletepost = function(req,res){
        const postid = req.params.todoid
        const userid = req.params.userid
        Post.deleteOne({_id:postid,user:userid})
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
//get all posts
postapicontrollers.getallposts = function(req,res){
    Post.find({})
    .then(function(postdata){
        if(postdata){
            res.status(200).json(postdata)
        }
    })
    .catch(function(err){
        console.log(err)
        res.status(404).json({message:"data not found"})
    })
}
//get data by owner or dealer
postapicontrollers.getdatabyownerordealer = function(req,res){
    const whatyouare = req.params.whatyouare
    console.log(whatyouare)
    Post.find({WhatYouAre:whatyouare})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        console.log(err)
        res.status(404).json({message:"data not found"})
    })
}
//rent or buy
postapicontrollers.getdatabyproperty = function(req,res){
    const property = req.params.PropertyType
    Post.find({ListPropertyFor:property})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        console.log(err)
        res.status(404).json({message:"data not available"})
    })
}
//searchbycity
postapicontrollers.searchbycity = function(req,res){
    const City = req.params.searchbycity
    Post.find({City:City})
    .then(function(result){
        if(result){
            res.status(200).json(result)
        }
    })
    .catch(function(err){
        console.log(err)
        res.status(404).json({message:"data not available"})
    })
}

//accommadation for family/single persons/ two persons
postapicontrollers.rentaccommadationfor = function(req,res){
    const accommadation = req.params.accommadation
    Post.find({AccomadationFor:accommadation})
    .then(function(data){
        if(data){
            res.status(200).json(data)
        }
    })
    .catch(function(err){
        console.log(err)
        res.status(404).json({message:"data not found"})
    })
}


postapicontrollers.paginationresult = async function(req,res){
    const page =   parseInt(req.query.page)
    const limit = parseInt(req.query.limit)


    const startindex = (page - 1) * limit
    const endindex = page * limit

    const results = {}

    if(endindex < await Post.countDocuments().exec()){
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
        
    Post.find({}).limit(limit).skip(startindex).exec()
    .then(function(result){
        if(result){
            console.log(result)
            results.results = result
            res.json(results)
        }
    })
    .catch(function(err){
        res.status(500).json({message:err.message})
    })

}

postapicontrollers.searchresult = function(req,res){
    const buyorrent = req.params.buyorrent
    const propertyfor = req.params.propertyfor
    const type = req.query.type
    const type1 = type.split(",")
    Post.find({ListPropertyFor:buyorrent,YourPropertyFor:propertyfor,PropertyType:{$in:type1}})
    .then(function(data){
        res.status(200).json(data)
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json(err.message)
    })

}



module.exports = postapicontrollers