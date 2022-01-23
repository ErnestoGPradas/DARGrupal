const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){

    var data = {
        members:[
            {
                email_address: req.body.email,
                status: "subscribed",
                merge_fields : {
                    FNAME: req.body.firstName,
                    LNAME: req.body.lastName
                }
            }

        ]
    }

    var jsonData = JSON.stringify(data);

    var url = "https://us7.api.mailchimp.com/3.0/lists/bc6dfdd761";
    const options = {
        method: "POST",
        auth: "Raquel:597c78aa74b486322bf9d8941b3b4cc0-us7"
    }
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            var dataReceived = JSON.parse(data);
            console.log(dataReceived);
            if(dataReceived.total_created === 1){
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();
    
    

})

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running in port 3000");
})
