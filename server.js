const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "userData.db");

let db = null;


 

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.run(
        `CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          location TEXT NOT NULL,
          profession TEXT NOT NULL
        )`
      );

    
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000/");
    });

  

    
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};



// Create new user profile
app.post('/createprofile', async (req, res) => {
    const { name, age, location, profession } = req.body;
    console.log(req.body)
    const sql = `INSERT INTO profiles (name, age, location, profession) VALUES ('${name}', '${age}', '${location}', '${profession}')`;
  
  const dbResponse = await db.run(sql);
  const profileId = dbResponse.lastID;
  res.send({ profileId: profileId });
});


// Get all profiles with sorting by location
app.get('/profiles', async (req, res) => {
    const sql = `SELECT * FROM profiles ORDER BY location`;
    
    const data = await db.all(sql)

    res.json(data)
  });

initializeDBAndServer();


