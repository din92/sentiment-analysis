import React,{Component} from "react";

class Tweets extends Component{
    constructor(props){
        super(props);
        this.props={tweets:[]}
        this.state={};
        this.analyzeText = this.analyzeText.bind(this);
    }
    componentDidMount() {
    }
     generateRandomNo(){
        let r = Math.floor(Math.random()*255);
        let g = Math.floor(Math.random()*255);
        let b = Math.floor(Math.random()*255);
        return `rgba(${r},${g},${b},0.8)`
    }
    analyzeText(text){
        send("/api->analyseText",{text}).then((resp)=>{
           if(resp.result && resp.result.emotions){
               let dataset=[],labels=[],backgroundColors=[];
               Object.keys(resp.result.emotions).map((key)=>{
                   dataset.push(resp.result.emotions[key]*100);
                   labels.push(key);
                   backgroundColors.push(this.generateRandomNo());
               });
               //generating chart
               var ctx = document.getElementById('myChart').getContext('2d');
               var myPieChart = new Chart(ctx, {
                   type: 'doughnut',
                   data: {
                       datasets: [{
                           label: "Sentiments",
                           backgroundColor: backgroundColors,
                           borderWidth: 3,
                           data:dataset

                       }],
                       // These labels appear in the legend and in the tooltips when hovering different arcs
                       labels: labels
                   },
                   options: {
                       responsive: true,
                       title:{
                           display: true,
                           text: "Analysing Text "+text
                       }
                   }
               });
           }
        })
    }
    render(){
        return (
            <div>
                {
                    this.props.tweets.map((elm,index)=>{
                        if(elm){
                            return (
                                <div className="pointer">
                                    <p key={index} onClick={()=>{
                                        this.analyzeText(elm.text)
                                    }}>{elm.text}</p>
                                </div>
                            )
                        }
                    })
                }
            </div>
        )
    }
}

export default Tweets;