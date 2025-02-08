const express = require("express")

const mysql = require("mysql2")

const app = express()

app.use(express.json())

//configure mysql connection 

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1425",
    database: "library"
})


// connect to mysql 
connection.connect((err) => {
    if (err) {
        console.log("error connection to mySQL:", err)
    }
})





// add a new book 

app.post("/books", (req, res) => {

    const { id, name, title } = req.body

    const query = "insert into books (id,name,title) values (?,?,?)"

    connection.query(query, [id, name, title], (err) => {
        if (err) {
            return res.status(500).json({ error: "error adding new book", details: err.message })
        }

        res.status(201).json({message : "book has been added"})
    })
})

//get all books

app.get("/books",(req,res)=>{

    const query = "select * from books "

    connection.query(query,(err,results)=>{

        if(err){
             return res.status(500).json({
                error:"error retrieving the books",
                details : err.message
             })}

             res.json(results)
        }
    )

})

// get book by id 
app.get("/books/:id",(req,res)=>{
    const query = "select * from books where id = ?"
    console.log(req.params.id);

    connection.query(query,[req.params.id],(err,results)=>{
        if(err){
            return res.status(500).json({
               error:"error retrieving the book by this id",
               details : err.message
            })}

            if(results.length===0){
                return res.status(404).json({
                    Message : "book by this id is not found"
                })


            }

            res.json(results[0])
          
    })
})

// update book by id 
app.put("/books/:id",(req,res)=>{
    const {name,title} = req.body

    const query = "update books set name =? , title=? where id =?" 

    connection.query(query,[name,title,req.params.id],(err,results)=>{
         if(err){
            return res.status(500).json({
               error:"error updating the book by this id",
               details : err.message
            })}

            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Book not found to update"
                })
            }

            res.status(200).json({
                Message :"Book has been updated "
            })
    })
})

// delete book by id 
app.delete("/books/:id",(req,res)=>{
    const query = "delete from books where id =?"
connection.query(query,[req.params.id],(err,results)=>{

    if(err){
        return res.status(500).json({
           error:"error deleting the book by this id",
           details : err.message
        })}

        if(results.affectedRows===0){
            return res.status(404).json({
                Message:"Book not found can't delete"
            })
        }

        res.status(200).json({
            Message :"Book has been deleted "
        })

})

})


// update the transalation by book id 
app.patch("/books/:id/translation",(req,res)=>{

    const {lanaguage} = req.body

    if(!lanaguage ||typeof lanaguage !=="string"){
        return res.status(400).json({error: "sorry invalid or missing language"})
    }

    const query = "update books set title = CONCAT(title, '- (',?,')') where id = ?"

    connection.query(query,[lanaguage,req.params.id],(err,results)=>{

        if(err){
            return res.status(500).json({
               error:"error updating translation",
               details : err.message
            })}
    
            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Book not found "
                })
            }
    
            res.status(200).json({
                Message :"Book translation has been updated "
            })
    
    })
    

})

// start the server 

const port = 3001 

app.listen(port,()=>{
    console.log("server has been started on " +`http://localhost/${port}`)
})
//here new code for bookshop ======>
//****************************************************************************************************** */
// get book shop by id 
app.get("/bookshop/id/:id",(req,res)=>{
    const query = "select * from bookshop where shop_id = ?"
    console.log("get bookshop by id: " +req.params.id);

    connection.query(query,[req.params.id],(err,results)=>{
        if(err){
            return res.status(500).json({
               error:"error retrieving the bookshop by this id",
               details : err.message
            })}

            if(results.length===0){
                return res.status(404).json({
                    Message : "bookshop by this id is not found"
                })
            }

            res.json(results[0]);//get first one 
          
    })
})

//add bookshop
app.post("/bookshop", (req, res) => {

    const { shop_id,city, name, contactNumber, email,  Address } = req.body

    const query = "insert into bookshop (shop_id,city,name,contactNumber,email,Address) values (?,?,?,?,?,?)"

    connection.query(query, [shop_id, city, name, contactNumber, email,  Address], (err) => {
        if (err) {
            return res.status(500).json({ error: "error adding new bookshop", details: err.message })
        }

        res.status(201).json({message : "bookshop has been added"})
    })
})


//get cities of bookshop
app.get("/bookshopCities",(req,res)=>{
    const query = "select DISTINCT city from bookshop"
   
    connection.query(query,[req.params.city],(err,results)=>{
        if(err){
            return res.status(500).json({
               error:"error retrieving the bookshop cities",
               details : err.message
            })}

            if(results.length===0){
                return res.status(404).json({
                    Message : "bookshops are not found"
                })
            }
            res.json(results);           
    })
})

//get bookshops by name 
app.get("/bookshop/name/:name",(req,res)=>{
    const query = "select * from bookshop where name = ?"
    console.log("get bookshop by name: " +req.params.name);

    connection.query(query,[req.params.name],(err,results)=>{
        if(err){
            return res.status(500).json({
               error:"error retrieving the bookshop by this name",
               details : err.message
            })}

            if(results.length===0){
                return res.status(404).json({
                    Message : "bookshop by this name is not found"
                })
            }

            res.json(results);//get all
          
    })
})

// getbookshop by email 
app.get("/bookshop/email/:email",(req,res)=>{
    const query = "select * from bookshop where email = ?"
    console.log("get bookshop by email: " +req.params.email);

    connection.query(query,[req.params.email],(err,results)=>{
        if(err){
            return res.status(500).json({
               error:"error retrieving the bookshop by this email",
               details : err.message
            })}

            if(results.length===0){
                return res.status(404).json({
                    Message : "bookshop by this email is not found"
                })
            }

            res.json(results[0]);//get first
          
    })
})

// update bookshop name by id
app.put("/bookshop/name/:id",(req,res)=>{
    const {name} = req.body

    const query = "update bookshop set name =? where shop_id =?" 

    connection.query(query,[name,req.params.id],(err,results)=>{
         if(err){
            return res.status(500).json({
               error:"error updating the bookshop name by this id",
               details : err.message
            })}

            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Bookshop not found to update"
                })
            }

            res.status(200).json({
                Message :"Bookshop name has been updated "
            })
    })
})

// update bookshop email by id
app.put("/bookshop/email/:id",(req,res)=>{
    const {email} = req.body

    const query = "update bookshop set email =? where shop_id =?" 
    console.log("update bookshop email by email: "+email)

    connection.query(query,[email,req.params.id],(err,results)=>{
         if(err){
            return res.status(500).json({
               error:"error updating the bookshop email by this id",
               details : err.message
            })}

            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Bookshop not found to update"
                })
            }

            res.status(200).json({
                Message :"Bookshop name has been updated "
            })
    })
})

//delete bookshop by id
app.delete("/bookshop/:id",(req,res)=>{
    const query = "delete from bookshop where shop_id =?"
connection.query(query,[req.params.id],(err,results)=>{

    if(err){
        return res.status(500).json({
           error:"error deleting the bookshop by this id",
           details : err.message
        })}

        if(results.affectedRows===0){
            return res.status(404).json({
                Message:"Bookshop not found can't delete"
            })
        }

        res.status(200).json({
            Message :"Bookshop has been deleted "
        })

})

})
