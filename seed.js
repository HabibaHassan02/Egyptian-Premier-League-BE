require("dotenv").config();
const mongoose = require('mongoose');
const Match = require('./models/matchModel');
const User= require('./models/userModel');
const bcrypt=require('bcryptjs')
const DBstring = "mongodb+srv://habibaelhussieny11:m1hLWDBhK8nCI3yR@epl-db.artxzrb.mongodb.net/";

const user_data=[
    {
        username: 'Habiba1',
        password: bcrypt.hashSync('1232001', 12),
        name: { firstName: 'Habiba', lastName: 'Hassan' },
        birthdate: new Date('2001-03-12'),
        gender: 'Female',
        city: 'Cairo',
        address: '123 Maadi Street',
        email: 'habibahassan@gmail.com',
        role: 'manager',
        passwordChangedAt: Date.now()
    },
    {
        username: 'salma1',
        password: bcrypt.hashSync('1572001', 12),
        name: { firstName: 'Salma', lastName: 'Ahmed' },
        birthdate: new Date('2001-07-15'),
        gender: 'Female',
        city: 'Cairo',
        address: '4 Manial Street',
        email: 'salmaahmed@gmail.com',
        role: 'manager',
        passwordChangedAt: Date.now()
    },
    {
        username: 'rofayda22',
        password: bcrypt.hashSync('442001', 12),
        name: { firstName: 'Rofayda', lastName: 'Bassem' },
        birthdate: new Date('2001-04-4'),
        gender: 'Female',
        city: 'Giza',
        address: '24 Dokki Street',
        email: 'rofaydabassem@gmail.com',
        role: 'fan',
        passwordChangedAt: Date.now()
    },

]
const match_data = [
    {
        homeTeam: 'Liverpool FC',
        awayTeam: 'Manchester United FC',
        matchVenue: 'Anfield',
        dateandtime: new Date('2024-01-15T20:00:00Z'),
        mainReferee: 'Mike Dean',
        linesmen: ['Assistant 1', 'Assistant 2'],
    },
    {
        homeTeam: 'Chelsea FC',
        awayTeam: 'Arsenal FC',
        matchVenue: 'Stamford Bridge',
        dateandtime: new Date('2024-01-22T20:00:00Z'),
        mainReferee: 'Martin Atkinson',
        linesmen: ['Assistant 3', 'Assistant 4'],
    },
    {
        homeTeam: 'Manchester City FC',
        awayTeam: 'Tottenham Hotspur FC',
        matchVenue: 'Etihad Stadium',
        dateandtime: new Date('2024-02-01T18:00:00Z'),
        mainReferee: 'Anthony Taylor',
        linesmen: ['Assistant 5', 'Assistant 6'],
    },
    {
        homeTeam: 'Leicester City FC',
        awayTeam: 'Everton FC',
        matchVenue: 'King Power Stadium',
        dateandtime: new Date('2024-02-08T20:00:00Z'),
        mainReferee: 'Michael Oliver',
        linesmen: ['Assistant 7', 'Assistant 8'],
    }
];

mongoose
.connect(DBstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async() => {
    await Match.deleteMany()
    await User.deleteMany()
    for (const match of match_data)
    {
        await Match.create(match);
    }
    for (const user of user_data)
    {
        await User.create(user);
    }

    console.log("mongodb connected successfully");
});
mongoose.connection.on("error", () => {
    console.log("mongodb connection Failed");
});