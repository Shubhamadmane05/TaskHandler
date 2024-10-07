var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");

var conString = "mongodb://127.0.0.1:27017";

var app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.get("/get-users", (req, res)=>{
    mongoClient.connect(conString).then(clientObject=>{
        var database = clientObject.db("task-Management-dash");
        database.collection("tblusers").find({}).toArray().then(documents=>{
             res.send(documents);
             res.end();
        });
    });
});
  app.post("/register-user",(req, res)=>{
    mongoClient.connect(conString).then(clientObject=>{
    var database = clientObject.db("task-Management-dash");
    var user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName, 
        Password: req.body.Password, 
        Email: req.body.Email, 
        Mobile: req.body.Mobile
    };
        database.collection("tblusers").insertOne(user).then(()=>{
            console.log('User Registered');
            res.end();
        });
    });
});

app.get("/get-task/:userid", (req, res)=>{
    mongoClient.connect(conString).then(clientObject=>{
        var database = clientObject.db("task-Management-dash");
        database.collection("tbltasks").find({UserId:req.params.userid}).toArray().then(documents=>{
             res.send(documents);
             res.end();
        });
    });
});

app.get("/tasks/:id", (req, res)=>{
    mongoClient.connect(conString).then(clientObject=>{
        var database = clientObject.db("task-Management-dash");
        database.collection("tbltasks").find({TaskId:parseInt(req.params.id)}).toArray().then(documents=>{
             res.send(documents);
             res.end();
        });
    });
});
app.post("/add-task", (req, res)=>{
    mongoClient.connect(conString).then(clientObject=>{
        var database = clientObject.db("task-Management-dash");
    var task = {
        TaskId: parseInt(req.body.TaskId),
        TaskTitle: req.body.TaskTitle,
        Description: req.body.Description,
        Date:new Date(req.body.Date),
        TaskStatus:req.body.TaskStatus,
        UserId:req.body.UserId
    }
        database.collection("tbltasks").insertOne(task).then(()=>{
             console.log('task Added Successfully..');
             res.end();
        })
    });
});

app.put("/edit-task/:id", (req, res) => {
    const id = parseInt(req.params.id); // Get the task ID from the request URL

    // Connect to MongoDB
    mongoClient.connect(conString).then(clientObject => {
        const database = clientObject.db("task-Management-dash"); // Ensure the correct database name is used

        // Task object to be updated
        const updatedTask = {
            TaskId: parseInt(req.body.TaskId),
            TaskTitle: req.body.TaskTitle,
            Description: req.body.Description,
            Date: new Date(req.body.Date),
            TaskStatus: req.body.TaskStatus,
            UserId: req.body.UserId
        };

        // Update the task in the database
        database.collection("tbltasks").updateOne(
            { TaskId: id }, // Filter to find the task by TaskId
            { $set: updatedTask } // Update the fields with the new values
        ).then(() => {
            console.log(`Task with ID ${id} updated successfully`);
            res.status(200).send({ message: 'Task updated successfully' });
        }).catch(err => {
            console.error(`Failed to update task: ${err}`);
            res.status(500).send({ message: 'Failed to update task' });
        }).finally(() => {
            clientObject.close(); // Close the MongoDB connection
        });
    }).catch(err => {
        console.error(`Database connection failed: ${err}`);
        res.status(500).send({ message: 'Database connection failed' });
    });
});

app.delete("/remove-task/:id", (req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conString).then(clientObject=>{
        var database = clientObject.db("task-Management-dash");
        database.collection("tbltasks").deleteOne({TaskId:id}).then(()=>{
            console.log(`task Deleted`);
            res.end();
        })
    });
});

app.listen(3300);
console.log(`Server Started : http://127.0.0.1:3300`);


