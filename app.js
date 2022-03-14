const express = require("express");
const app = express();
const db = require('mariadb');
app.use(express.json());

const{Sequelize,Model,DataTypes} = require('sequelize');

const sequelize = new Sequelize('log', 'root', 'abhay123',{
    host: 'localhost',
    dialect: 'mariadb'
  });


class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

// define method to define the table

const UserDetail = sequelize.define("user_detail", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//  foreign key
UserDetail.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

app.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ where: { username: username } });
  const userDetail = await UserDetail.findOne({ where: { user_id: user.id } })
  if (user === null) {
    res.send("User not found");
  } else {
    res.send({user, userDetail});
  }
});

app.get("/userlist", async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "username", "password"],
  });
  if (users === null) {
    res.send("Empty List");
  } else {
    res.send(users);
  }
});

app.post("/signup", async (req, res) => {
  await sequelize.sync();
  let { username, password, firstName, lastName, phoneNumber } = req.body;
  const user = await User.create({ username: username, password: password });
  const userDetail = await UserDetail.create({firstName: firstName,lastName: lastName,phoneNumber: phoneNumber,user_id: user.id,
  });
  res.send("Data updated");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({where: { username: username, password: password },
  });
  if (user === null) {
    res.send("User not found/Invalid Credential");
  } else {
    //res.write("LOGGED IN");
    res.send(user);
  }
    //res.end("logged IN");
});

app.delete("/user/:username/delete", async (req, res) => {
  const username = req.params.username;
  const user = await User.destroy({ where: { username: username } })
    .then(function (deletedRecord) {
      if (deletedRecord === 1) {
        res.status(200).json({ message: "Deleted successfully" });
      } else {
        res.status(404).json({ message: "record not found" });
      }
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
});

app.patch("/user/:username/update", async (req, res) => {
  let { username, firstName, lastName, phoneNumber } = req.body;
  const user = await User.findOne({ where: { username: username } });
  const userDetail = await UserDetail.findOne({
    where: { user_id: user.id },s
  })
    .then((data) => {
      return data.update({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      });
    })
    .catch((err) => {
      res.send("data not found");
      console.log(err);
    });
  res.send("data updated");
  console.log(userDetail);
});

app.listen(8000, (req, res) => {
  console.log(`listening on port 8080`);
});