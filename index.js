const express = require('express');
const cors = require('cors');
const User = require('./User'); // assuming the model is in User.js
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const app = express();
const port = 3000;
const creds = require("./gsheet.json");
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/submit', async (req, res) => {
    const SCOPES = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
    ];
      
    const jwt = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: SCOPES,
    });
      
    const doc = new GoogleSpreadsheet(
        "18L7FvFSHEJvB6zoNny2oxvGYRSGYr-jzEYW_t-PKfzU",
        jwt
    );
    
    const newUser = new User(req.body);
    await newUser.save()
        .then(async () => {
            await doc.loadInfo();
            const sheet = doc.sheetsByTitle["Sheet1"];
            await sheet.clear();
            const headerRow = ['Name', 'Batch', 'Email', 'Phone', 'Occupation', 'Achievements', 'Designation', 'City', 'Address'];
            await sheet.setHeaderRow(headerRow);

            // Fetch all users from the database
            const users = await User.find({});
            
            // Format the data to match the header rows
            const data = users.map(user => ({
                Name: user.name,
                Batch: user.batch,
                Email: user.email,
                Phone: user.phone,
                Occupation: user.occupation,
                Achievements: user.achievements,
                Designation: user.designation,
                City: user.city,
                Address: user.address
            }));

            // Add the data to the sheet
            await sheet.addRows(data);

            res.json('User added and spreadsheet updated!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});