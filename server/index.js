import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import { config } from 'dotenv';

config();
const db_token = process.env.DB_TOKEN;
const port = process.env.API_PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


const userConnection = mongoose.createConnection(db_token, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

userConnection.on('error', (error) => {
	console.error('Error connecting to MongoDB:', error);
});

userConnection.once('open', () => {
	console.log('Connected to Database !');
});


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contactNo: String,
    jobTitle: String
},{
	versionKey: false // Disable versioning
});


const taskConnection = userConnection.useDb('Tasks');
const taskSchema = mongoose.Schema({
	title: String,
	description: String,
	dueDate: String,
	status: String,
	userAv: String,
	userName: String
},{
	versionKey: false // Disable versioning
});

const User = userConnection.model("User", userSchema);
const Tasks = taskConnection.model("Tasks", taskSchema);


// Routes
app.post("/login", async (req, res) => {
	const {email, password} = req.body;
	
	try{
		const user = await User.findOne( {email: email} );

		if(user === null) res.send( {message: "User is not Registered, Please SignUp"});
		else{
			if(password === user.password) res.send({message: "Successfully Logged In", user: user});
			else res.send( {message: "Invalid Username or Password"});
		}
	}catch(error){
		console.log("Error while Logging In: ", error.message);
		res.status(500).send("An error occurred while logging in.");
	}
});

app.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password, phone, jobTitle, countryCode } = req.body;
    let name = firstName  + " " + lastName;
    let contactNo = countryCode + " " + phone;

	if(await User.exists( {email: email} )){
		res.send( {message: "User already Registered"});
	}else{
		const user = new User({
			name, email, password, contactNo, jobTitle 
		});

		try{			
			await user.save();
			res.send( {message: "Sucessfully Registered", user: user} );
		}catch(error){
			console.log("Error while signing up into the database: ", error.message);
			res.status(500).send("An error occurred while signing up.");
		}
	}
});


app.get("/showAllTasks", async (req,res) => {
	try{
		const allTasks = await Tasks.find();
		res.send( {message: "Successfully Fetched", allTasks: allTasks} );
	}catch(error){
		console.log("Error while Fetching All Tasks: ", error.message);
		res.status(500).send("An error occurred while fetching all the tasks.");
	}
});

app.post("/add", async (req, res) => {
	const { title, description, dueDate, status, userAv, userName } = req.body;
	const task = new Tasks({
		title, description, status, dueDate, userAv, userName
	});

	try{			
		await task.save();
		res.send( {message: "Sucessfully Added", task: task});
	}catch(error){
		console.log("Error while adding task into the database: ", error.message);
		res.status(500).send("An error occurred while adding the task.");
	}
});

app.post("/delete/:_id", async (req,res)=>{
	try{
		await Tasks.findByIdAndDelete(req.params._id);
		res.send( {message: "Successfully Deleted"} );
	}catch(error){
		console.log("Error while Deleting current Task: ", error.message);
		res.status(500).send("An error occurred while deleting the task.");
	}
});

app.post("/markdone/:_id", async (req,res)=>{
	try{
		await Tasks.findOneAndUpdate(
			{ _id: req.params._id  },
			{ status: "Successful" }
		);
		res.send( {message: "Successfully Marked Successful"} );
	}catch(error){
		console.log("Error while Changing Status: ", error.message);
		res.status(500).send("An error occurred while updating the task.");
	}
});

app.post("/update/:_id", async (req,res)=>{
	const { title, description, dueDate, status, userAv, userName } = req.body;
	const curTask = new Tasks({
		title, description, status, dueDate, userAv, userName
	});
	console.log(curTask);
		
	try{
		await Tasks.findOneAndUpdate(
			{ _id: req.params._id },
			{
				title: req.body.title,
				description: description,
				status: status,
				dueDate: dueDate,
				userAv: userAv,
				userName: req.body.userName
			}
		);
		const updatedTask = await Tasks.findById(req.params._id);
		res.send( {message: "Successfully Updated", task: updatedTask} );
	}catch(error){
		console.log("Error while Updating current task: ", error.message);
		res.status(500).send("An error occurred while updating the task.");
	}
});

app.listen(port, () => {
	console.log(`Listening to Port ${port}`);
});

export { app };