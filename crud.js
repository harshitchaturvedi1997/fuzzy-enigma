const express = require("express");
const app = express();
const db = require('mariadb');
app.use(express.json());

const{Sequelize,Model,DataTypes} = require('sequelize');

const sequelize = new Sequelize('db', 'root', 'abhay123',{
    host: 'localhost',
    dialect: 'mariadb'
  });
  
async function fun(){
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
     } 
  
  catch (error) {
    console.error('Unable to connect to the database:', error);
     }
}
fun();


class User extends Model{};

User.init(
{
        id:{
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
    username : DataTypes.STRING,
    password : DataTypes.STRING

    }, {sequelize,
        modelName : 'check'} 
    
);

app.get('/get' , async function(req,res){
    let data = await User.findAll({ attributes : ['id','username','password']
    });
    console.log(data);
    //let data = await User.find({attributes:['username']});
    res.send(data);
});


app.post('/post',async(req,res)=>{
    await sequelize.sync()
    const user = await User.create({
        username : req.body.username,
        password : req.body.password
    })
    res.send("User create");
  })


  app.patch('/update',async (req,res)=>{
    await User.update({username:req.body.username},{where: {username:req.body.olduser}})
    console.log('data Updated');
    res.send('data Updated');
  });

  app.delete('/delete',async(req,res)=>{
      
      await User.destroy({where: {username : req.body.username}})
      console.log('Data Deleted');
      res.send("Data Deleted");
  })
  

app.listen(8000,()=>{
    console.log("WELCOME TO PORT 8000");
});
