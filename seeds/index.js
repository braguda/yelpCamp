
const mongoose = require("mongoose");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp', {
    useNewUrlParser: true,  
    useUnifiedTopology: true})
.then(() => {
    console.log("Connection Open!!!");
})
.catch(err => {
    console.log("Oh NO ERROR!!!!", err)
});

const campName = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    let price = Math.floor(Math.random() *20 +10 );
    for (let i = 0; i < 300; i++){
        let randomNum = Math.floor(Math.random() *1000);
        let camp = new Campground({
            author: "640d2ff1a7313c617de63d20",
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${campName(descriptors)} ${campName(places)}`,
            geometry: { type: 'Point', 
                        coordinates: 
                        [cities[randomNum].longitude, 
                        cities[randomNum].latitude] },
            images: [
                {
                  url: 'https://res.cloudinary.com/dmm49vvvy/image/upload/v1679087811/yelpCamp/wtmxw8qr5d8zne1fbtdv.jpg',
                  filename: 'yelpCamp/wtmxw8qr5d8zne1fbtdv'
                },
                {
                  url: 'https://res.cloudinary.com/dmm49vvvy/image/upload/v1679087810/yelpCamp/jtnrdtfctmjgdwldua1a.jpg',
                  filename: 'yelpCamp/jtnrdtfctmjgdwldua1a'
                },
                {
                  url: 'https://res.cloudinary.com/dmm49vvvy/image/upload/v1679087811/yelpCamp/lo17lbg2f4ffxxtwmui6.jpg',
                  filename: 'yelpCamp/lo17lbg2f4ffxxtwmui6'
                }
              ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam sint cupiditate rerum incidunt saepe nostrum quidem, facere quos sunt modi fugiat, odio animi aliquid porro laborum dolorem, harum commodi odit.",
            price: price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
