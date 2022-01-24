

const http = require('http');
const pug = require("pug");



const express = require('express');
let app = express();

//mongo
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;
var session = require('express-session');
const { Recoverable } = require('repl');
let loggedIn;

app.set("view engine", "pug");
app.use(express.json())
app.use(express.static("public"));
app.use(session({ secret: "10001", resave: true, saveUninitialized: true }))
app.use(express.urlencoded({ extended: false }));


//routes


app.get("/" || "/home", sendHome);
app.get("/search", sendSearch)
app.get("/searchresults?", sendResults)

app.get("/movies?", sendMovie) 
app.get("/person?", sendPerson) 

app.post("/watchmovie", watchMovie)
app.post("/followperson", followPerson)
app.post("/review", sendAReview)
app.get("/users/otheruser?", sendOtherProfile)
app.get("/changeAcctType", changeAcctType)

app.post("/contribute", sendContribute)
app.get("/contribute", contribute)
app.post("/signup", signup)
app.get("/userauth", sendUserAuth)
app.post("/logout", logout)
app.post("/unfollowperson", unfollowPerson)   

function changeAcctType(req, res) {
	req.session.user.contributing = !req.session.user.contributing
	db.collection("users").updateOne({ username: req.session.user.username }, { $set: { contributing: req.session.user.contributing } })

	res.render("profile")

}


app.get("/reviews/examplereview", sendReview)



app.post("/login", login)

app.post("/followother", followOther)

function followOther(req, res) {

	req.session.user.followUser.push(req.body)

	console.log(req.session.user.followUser)

	len = req.session.user.followUser.length



	res.end()

}





function logout(req, res) {
	req.session.loggedin = false
	req.session.user = null
	console.log(req.session)
	res.render("userauth")
}

function unfollowPerson(req, res) {
	req.session.user.followPerson = req.session.user.followPerson.filter(function (value) {
		return value != req.body.name;
	})
	db.collection("users").updateOne({ username: req.session.user.username }, { $set: { followPerson: req.session.user.followPerson } })

	res.end()


}





function watchMovie(req, res) {
	if (req.session.user == null) {
		return;
	}

	db.collection("movies").findOne({ _id: mongo.ObjectId(req.body._id) }, function (err, movie) {
		req.session.user.watched.push(movie)
		console.log(movie)
		db.collection("users").updateOne({ username: req.session.user.username }, { $push: { watched: req.session.user.watched[0] } })
		console.log(req.session.user)

	})


}


function followPerson(req, res) {
	if (req.session.user == null) {
		return;
	}
	var personReg = new RegExp(req.body.name, 'i')
	reccomended = []


	db.collection("movies").find({
		$or: [
			{ Director: personReg },
			{ Writer: personReg },
			{ Actors: personReg }
		]
	}).toArray(function (err, data) {

		console.log(req.session.user)


		reccomended.push(data)

		db.collection("movies").find({ Director: personReg }).toArray(function (err, dataDirected) {
			reccomended.push(dataDirected)
			db.collection("movies").find({ Writer: personReg }).toArray(function (err, dataWriter) {
				reccomended.push(dataWriter)
				reccomended = [].concat(reccomended[0], reccomended[1], reccomended[2])
				let val = Math.floor(Math.random() * reccomended.length);
				console.log(val)

				db.collection("users").updateOne({ username: req.session.user.username }, { $push: { reccomended: reccomended[val] } })

				var reccomendedMov = { Title: reccomended[val].Title, _id: reccomended[val]._id }

				if (!req.session.user.reccomended.some(movie => movie.Title == reccomendedMov.Title))
					req.session.user.reccomended.push(reccomendedMov)

				if (!req.session.user.followPerson.some(person => person == req.body.name)) {
					req.session.user.followPerson.push(req.body.name)
					let len = req.session.user.followPerson.length
					db.collection("users").updateOne({ username: req.session.user.username }, { $push: { followPerson: req.session.user.followPerson[len - 1] } })

				}

				res.end()


			})
		})

	})


}



function sendAReview(req, res) {
	var review = req.body
	review.userid = req.session.user._id
	review.username = req.session.user.username
	db.collection("movies").findOne({ _id: mongo.ObjectID(review.id) }, function (err, movie) {
		review.title = movie.Title
		console.log(review)
		req.session.user.reviews.push(review)

		db.collection("users").updateOne({ username: req.session.user.username }, { $push: { reviews: req.session.user.reviews } })
		db.collection("movies").updateOne({ _id: mongo.ObjectID(review.id) }, { $push: { Reviews: review } })

		console.log(req.session.user)
	})


}


app.get("/profile", sendUserProfile)

function sendUserProfile(req, res) {
	if (!req.session.loggedin) {
		send401(res)
	}

	console.log(req.session)

	let username = req.session.user.username
	let password = req.session.user.password



	db.collection("users").find({ username: username, password: password }).toArray(function (err, result) {
		if (err) {
			throw err;
		}
		if (result == null) {
			res.write("no user found");
		}
		if (result) {
			res.render("profile", { user: result[0] })
		}
	})
}

function signup(req, res) {
	if (req.session.loggedin) {

		return;
	}
	const user = {
		username: req.body.username,
		password: req.body.password,
		contributing: false,
		followPerson: [],
		followUser: [],
		watched: [],
		reccomended: [],
		notifications: [],
		reviews: []
	}

	try {
		db.collection("users").insertOne(user);
	} catch (e) {
		console.log(e);
	};
	req.session.loggedin = true;

	req.session.user = user;
	console.log(req.session.user)
	return res.render("profile", { user: user })
}



function login(req, res, next) {
	if (req.session.loggedin) {
	
		return;
	}

	let username = req.body.username;
	let password = req.body.password;

	db.collection("users").find({ $and: [{ username: username }, { password: password }] }).toArray(function (err, result) {
		console.log(result)
		if (result.length == 0) {
			console.log(req.session)
			res.statusCode = 404
			res.end()
		}
		else {
			console.log("huh")

			req.session.loggedin = true;
			req.session.user = result[0]

			res.statusCode = 200
			res.end()
		}
	})
}

function sendContribute(req, res) {
	if (req.session.user == null || !req.session.user.contributing) {
		send403(res)
		return;
	}

	try {
		db.collection("movies").insertOne(req.body);
		res.status(200).send("Movie added");
	} catch (e) {
		console.log(e);
	};

}



function sendPerson(req, res) {

	const userQ = req.url.split("?")
	var personName = userQ[1]
	var queryPerson = personName.replace("%20", " ")
	queryPerson = queryPerson.replace("%20", " ")

	var personReg = new RegExp(queryPerson, 'i')


	db.collection("movies").find({
		$or: [
			{ Director: personReg },
			{ Writer: personReg },
			{ Actors: personReg }
		]
	}).toArray(function (err, data) {

		newPerson = new Object();

		newPerson.name = queryPerson
		newPerson.history = data

		db.collection("movies").find({ Director: personReg }).toArray(function (err, dataDirected) {
			newPerson.directed = dataDirected
			db.collection("movies").find({ Writer: personReg }).toArray(function (err, dataWriter) {
				newPerson.writer = dataWriter
				res.render("person", { person: newPerson })
			})
		})

	})

}




function sendMovie(req, res) {

	const userQ = req.url.split("?")
	var id = userQ[1]
	db.collection("movies").findOne({ _id: mongo.ObjectId(id) }, function (err, data) {

		db.collection("movies").find({ Director: data.Director }).toArray(function (err, movies) {
			movies.forEach(movie => {
				movie.id = movie._id.valueOf().toString()
			})
			data.Similiar = [].concat(movies).filter(function (value) {
				return value.Title != data.Title;
			})
			console.log(data.Similiar)
			res.status(200).render("movie", { movie: data })
		})
	})


}



function sendResults(req, res) {

	const userQ = req.url.split("?")
	var queryTitle = userQ[1].split("=")[1]
	var queryGenre = userQ[2].split("=")[1]
	var queryActor = userQ[3].split("=")[1]


	queryTitle = queryTitle.replace("%20", " ")
	queryTitle = queryTitle.replace("%20", " ")
	queryGenre = queryGenre.replace("%20", " ")
	queryActor = queryActor.replace("%20", " ")
	queryActor = queryActor.replace("%20", " ")

	var TitleReg = new RegExp(queryTitle, 'i')
	var GenreReg = new RegExp(queryGenre, 'i')
	var ActorReg = new RegExp(queryActor, 'i')

	db.collection("movies").find({
		$and: [
			{ Title: { $regex: TitleReg } },
			{ Genre: { $regex: GenreReg } },
			{ Actors: { $regex: ActorReg } }
		]
	}).toArray(function (err, data) {

		if (data.length > 10) {
			data.splice(10)
		}

		res.send(JSON.stringify(data))
	})

}

function sendHome(req, res) {
	res.status(200)
	res.render("home")
}

function contribute(req, res) {
	if (req.session.user == null || !req.session.user.contributing) {
		send403(res)
		return;
	}
	res.status(200)
	res.render("contribute")
}



function sendOtherProfile(req, res) {

	const userQ = req.url.split("?")
	var id = userQ[1]

	db.collection("users").findOne({ _id: mongo.ObjectId(id) }, function (err, data) {
		res.status(200).render("user", { user: data })
	})
}



function sendReview(req, res) {
	res.status(200)
	res.render("review", { review: review })
}

function sendUserAuth(req, res) {
	res.status(200)
	res.render("userauth")
	res.end();
}

function sendSearch(req, res) {
	res.status(200)
	res.render("search")
}




function send404(response) {
	response.statusCode = 404;
	response.write("Unknwn resource.");
	response.end();
}

function send403(response) {
	response.statusCode = 403;
	response.write("Error 403: You are forbidden from accessing this page.");
	response.end();
}

function send401(response) {
	response.statusCode = 401;
	response.write("Error 401: You are not authorized to visit this page.");
	response.end();
}

function send201(response) {
	response.statusCode = 201;
	response.write("Already Logged In.");
	response.end();
}

function sendBadUser(response) {
	response.statusCode = 202
	response.write("bad user")
	response.end();
}



//Start server
MongoClient.connect("mongodb://localhost:27017/", function (err, client) {
	if (err) throw err;

	//Get the database
	db = client.db("moviedb");

	// Start server once Mongo is initialized
	app.listen(3000);
	console.log("Listening on port 3000");

});




console.log("Click the following link: http://localhost:3000");