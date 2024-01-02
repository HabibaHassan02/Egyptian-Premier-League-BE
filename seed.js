require("dotenv").config();
const mongoose = require('mongoose');
const Match = require('./models/matchModel');
const User= require('./models/userModel');
const Stadium = require('./models/stadiumModel');
const bcrypt=require('bcryptjs')
const DBstring = "mongodb+srv://habibaelhussieny11:m1hLWDBhK8nCI3yR@epl-db.artxzrb.mongodb.net/";

const seedDB = async () => {
    // Connect to the MongoDB server
    await mongoose.connect(DBstring, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    // Delete existing data
    await User.deleteMany({});
    await Match.deleteMany({});
    await Stadium.deleteMany({});

    const users = await User.insertMany([
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
        }
    ]);

    const stadiums = await Stadium.insertMany([
        {
            name: { firstName: 'Cairo', lastName: 'Stadium' },
            location: 'Nasr City,Cairo,Egypt',
            numberOfRows: 50,
            numberOfSeatsperRow: 100,
            numberOfVacantSeats: 3000,
            numberOfReservedSeats: 1000
        },
        {
            name: { firstName: 'Borg', lastName: 'ElArab' },
            location: 'Borg El Arab, Alexandria, Egypt',
            numberOfRows: 50,
            numberOfSeatsperRow: 100,
            numberOfVacantSeats: 3000,
            numberOfReservedSeats: 1000
        },
        {
            name: { firstName: 'Wembly', lastName: 'Stadium' },
            location: 'London, England',
            numberOfRows: 50,
            numberOfSeatsperRow: 100,
            numberOfVacantSeats: 3000,
            numberOfReservedSeats: 1000
        },
        {
            name: { firstName: 'Camp', lastName: 'Nou' },
            location: 'Barcelona, Spain',
            numberOfRows: 50,
            numberOfSeatsperRow: 100,
            numberOfVacantSeats: 3000,
            numberOfReservedSeats: 1000
        }
    ]);
    console.log(stadiums[0]._id)
    const matches = await Match.insertMany([
        {
            homeTeam: 'Liverpool FC',
            awayTeam: 'Manchester United FC',
            matchVenue: stadiums[0]._id,
            dateandtime: new Date('2024-01-15T20:00:00Z'),
            mainReferee: 'Mike Dean',
            linesmen: ['Assistant 1', 'Assistant 2'],
        },
        {
            homeTeam: 'Chelsea FC',
            awayTeam: 'Arsenal FC',
            matchVenue: stadiums[1]._id,
            dateandtime: new Date('2024-01-22T20:00:00Z'),
            mainReferee: 'Martin Atkinson',
            linesmen: ['Assistant 3', 'Assistant 4'],
        },
        {
            homeTeam: 'Manchester City FC',
            awayTeam: 'Tottenham Hotspur FC',
            matchVenue: stadiums[2]._id,
            dateandtime: new Date('2024-02-01T18:00:00Z'),
            mainReferee: 'Anthony Taylor',
            linesmen: ['Assistant 5', 'Assistant 6'],
        },
        {
            homeTeam: 'Leicester City FC',
            awayTeam: 'Everton FC',
            matchVenue: stadiums[3]._id,
            dateandtime: new Date('2024-02-08T20:00:00Z'),
            mainReferee: 'Michael Oliver',
            linesmen: ['Assistant 7', 'Assistant 8'],
        }
    ]);
    
    
    console.log('Database seeded!');
};
seedDB().then(() => {
    mongoose.connection.close();
});













