let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;
const fs = require("fs");



let moviesAll = JSON.parse(fs.readFileSync("movie-data-2500.json"));
moviesAll.forEach(movie =>{
	movie.Reviews = []
	movie.Similiar = []
})

var admin = [{
	username: "a",
	password: "a",
	contributing: true,
	followPerson: [],
	followUser: [],
	watched: [],
	reccomended: [],
	notifications: [],
	reviews: []
}]


MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;

  db = client.db('moviedb');
  db.dropCollection("movies", function(err, result){
	  if(err){
			console.log("Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)")
		}else{
				console.log("Cleared cards collection.");
		}

		db.collection("movies").insertMany(moviesAll, function(err, result){
			if(err) throw err;
			console.log("Successfuly inserted " + result.insertedCount + " movies.")
			db.dropCollection("users", function(err, result){
				if(err){
					  console.log("Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)")
				  }else{
						  console.log("Cleared users collection.");
				  }
		  
				db.collection("users").insertMany(admin,function(err,result){
					if(err) throw err;
					console.log("Successfuly inserted " + result.insertedCount + " users.")
					process.exit();
				})
		})
  });
})
});