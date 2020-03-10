let child = require("child_process");
let path = require("path");
let twitter = require("twitter");
let unirest = require("unirest");

class SentimentAPI{
    constructor(common) {
        this.common = common;
        this.client = new twitter({
            consumer_key: process.env.APIKey,
            consumer_secret: process.env.APISecretKey,
            access_token_key:process.env.AccessToken,
            access_token_secret:process.env.AccessTokenSecret,
            bearer_token:process.env.TWITTER_BEARER_TOKEN
        });
    }
    async analyseText(responder,data={})
    {
        let {text}= data;
        if(text){
            /*
             let pythonProcess=child.spawn("python",[path.resolve(this.common.pythonFile),text]);
            console.log("pythonProcess",pythonProcess,path.resolve(this.common.pythonFile))
            pythonProcess.stdout.on("data",(data)=>{
                console.log("got data",data);
                // responder.respond({done:true,data})
            })
            * */
            let req = unirest("POST", "https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/");
            req.headers({
                "x-rapidapi-host": process.env.RapidAPIHost,
                "x-rapidapi-key": process.env.RapidAPIKey,
                "content-type": "application/x-www-form-urlencoded"

            });
            req.form({
                "text":text
            });
            req.end(function (res) {
                if (res.error) {
                    console.log(res.error);
                    responder.respond({done:false,error:"Error occurred in processing text"})
                }
                if(res.body && res.body.result_code ==="200"){
                    responder.respond({done:true,result:{emotions_detected:res.body.emotions_detected,emotions:res.body.emotion_scores}})
                }
                else responder.respond({done:false,error:"Unable to procees text"})
            });
        }
        else {
           responder.respond({done:false,error:"Text not provided"});
        }
        return;
    }
    async fetchLatestTweets(responder,data={}){
        let {user}=data;
        if(user){
            this.client.get('/statuses/user_timeline.json',{screen_name:data.user,count:5},(error,tweets,response)=>{
                if(error){
                    responder.respond({done:false,error});
                    return;
                }
                if(tweets){
                    responder.respond({done:false,result:tweets});
                }
            })
        }
        else {
            responder.respond({done:false,error:"User not provided"});
        }
        return;
    }
}

module.exports= SentimentAPI;