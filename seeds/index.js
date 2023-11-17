const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

async  function fetchRandom() {
    const API_KEY = 'Y2I_gXxyRIJizGFtrbXQOxNaXEjWG0q1pPEUPMwoTt4';
    const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}`;
    // Make a GET request to the Unsplash API
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Extract the image URL from the API response
        const imageUrl = data.urls.regular;

        return imageUrl;
    } catch (error) {
        console.error('Error fetching random photo:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }


}
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const imageUrl = await fetchRandom();
        const camp = new Campground({
            author: '654d7b0b1f54183788b7aa88',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: imageUrl,
            description: 'lorem asdk laks laskdl adk lakdl adkla ldka aldkd alsdkas dladkad lkd a',
            price: Math.floor(Math.random() * 30) + 10,

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

