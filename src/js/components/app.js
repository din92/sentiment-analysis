import React,{Component} from "react";

import Tweets from "./tweets";
class App extends Component{
    constructor(props){
        super(props);
        this.state={tweets:[]};
        this.onSelect = this.onSelect.bind(this);

    }
    onSelect(elm){
        let value =elm.target.value;
        if(value){
            send("/api->fetchLatestTweets",{user:value}).then((resp)=>{
                if(resp && resp.result && resp.result instanceof Array){
                    this.setState({tweets:resp.result});
                }
            })
        }
    }
    render(){
        return(
            <div>
                <div>
                    <h1> Let's Analyze the sentiments of our leaders</h1>
                    <select onChange={this.onSelect}>
                        <option value="" >Select Leader</option>
                        <option value="realDonaldTrump" >Donald Trump</option>
                        <option value="narendramodi">Narendara Modi</option>
                        <option value="Plaid_Merkel">Angela Merkel</option>
                        <option value="JeffBezos">Jeff Bezos</option>
                        <option value="BillGates">Bill Gates</option>
                        <option value="elonmusk">Elon Musk</option>
                    </select>
                </div>
                <Tweets tweets={this.state.tweets}/>
                <canvas id="myChart" width="50" height="50"/>
            </div>
        )
    }
}

export default App;