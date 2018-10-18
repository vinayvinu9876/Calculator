/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Alert,StyleSheet, Text, View,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
  
    this.state = {output_value:'0',comment:'Hi, i m your math assistant.',expression:'',calculated:false};
    
  }  

  all_clear=()=>{
    console.log("All clear command recieved");
    this.setState({output_value:'0',expression:''});
  }

  push_values=(val)=>{
    
    let temp_out=this.state.output_value;

    if(temp_out=='0'){
      temp_out=val;
    }else{
      temp_out=temp_out+val; 
    }
    
    this.setState({output_value:temp_out});
    
    
  }
  
  back_space=()=>{

    if(this.state.calculated){//When the output is jzt calculated
      this.setState({output_value:this.state.expression,expression:'',calculated:false});
    }
    else{
      let temp_op=this.state.output_value;
      temp_op=temp_op.substring(0,temp_op.length-1);
      console.log(temp_op);
      if(temp_op==''){
        temp_op='0';
      }

      this.setState({output_value:temp_op});
    }

  }

  calculate=()=>{

      var exp=this.state.output_value;
      var postfix=this.MathSolver(exp);
      console.log(postfix);
      var result=this.evaluate_postfix(postfix);
      console.log(result);
      this.setState({expression:this.state.output_value,output_value:result,calculated:true});
  }    

  

//Function to convert Infix to Postfix
//Input infix string
//Output Postfix String
MathSolver=(infix)=> {
        var outputQueue = "";
        var operatorStack = [];
        var operators = {
            "^": {
                precedence: 4,
                associativity: "Right"
            },
            "/": {
                precedence: 3,
                associativity: "Left"
            },
            "*": {
                precedence: 3,
                associativity: "Left"
            },
            "+": {
                precedence: 2,
                associativity: "Left"
            },
            "-": {
                precedence: 2,
                associativity: "Left"
            }
        }
        infix = infix.replace(/\s+/g, "");
        infix = this.clean(infix.split(/([\+\-\*\/\^\(\)])/));
        for(var i = 0; i < infix.length; i++) {
            var token = infix[i];
            if(this.isNumeric(token)) {
                outputQueue += token + " ";
            } else if("^*/+-".indexOf(token) !== -1) {
                var o1 = token;
                var o2 = operatorStack[operatorStack.length - 1];
                while("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                    outputQueue += operatorStack.pop() + " ";
                    o2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(o1);
            } else if(token === "(") {
                operatorStack.push(token);
            } else if(token === ")") {
                while(operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue += operatorStack.pop() + " ";
                }
                operatorStack.pop();
            }
        }
        while(operatorStack.length > 0) {
            outputQueue += operatorStack.pop() + " ";
        }
        return outputQueue;
    }


  
  //Function to clean the empty slots in the array
  //Input array
  //Output cleaned Array
  clean = (arr)=> {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === "") {
            arr.splice(i, 1);
        }
    }
    return arr;
  }


  getElemVal=(operand,elem1,elem2)=>{
    switch(operand){
      case '+':return elem2+elem1;break;
      case '-':return elem2-elem1;break;
      case '*':return elem2*elem1;break;
      case '/':return elem2/elem1;break;
    }
  }

  //PostFix Evaluation
  //Input postfix expression as string
  //Output Result of postfix operation
  evaluate_postfix=(exp)=>{
    let temp=null;
    let stack=[];
    let expression=exp.split(" ");
    expression.pop();//To eliminate the last unwanted element that is space
    let i=0; 

    while(i!=expression.length){
      temp=expression[i];
      if(this.isNumeric(temp)){
        stack.push(temp); 
      }
      else{
        stack.push(this.getElemVal(temp,parseFloat(stack.pop()),parseFloat(stack.pop())));
      }
      i++;
    }

    let result=stack.pop();

    if(!this.isInt(result)){
      result=result.toFixed(4);
    }

    return result;

  }
  //Check_Int()
  //Function to check whether the number is int or float
  //Input number
  //Output True or False
  isInt=(n)=>{
    return n%1===0;
  }
  //Function to determine whether a string is number
  //Input character
  //Output True or False 
  isNumeric=(n)=>{
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  render() {
    return (
      <View style={styles.container}>
        <Tab />
        <WorkBench expression={this.state.expression} output_value={this.state.output_value} comment={this.state.comment} />
        <CalcKeyBoard push_values={this.push_values} all_clear={this.all_clear} calculate={this.calculate} back_space={this.back_space} />
      </View>
    ); 
  }
}


class Tab extends Component{
  render(){
    return(
        <View style={styles.tab}>
            <Text style={styles.pre_title}>VP</Text><Text style={styles.title}>Calculator</Text>
        </View>
    )
  }
}

class CalButton extends Component{
    render(){
      return(
        <TouchableWithoutFeedback onPress={()=>this.props.push_values(this.props.symbol)}>
            <View style={this.props.view_style}>
              <Text style={this.props.op_style}>{this.props.symbol}</Text>
            </View>
        </TouchableWithoutFeedback>
      )
    }
}


class WorkBench extends Component{
  render(){
    return(
      <View style={styles.workbench}>
            
              <View style={styles.output}>
                  <Text style={styles.input_text}>{this.props.expression}</Text>
              </View>

              
                <View style={styles.output}>
                    <Text style={styles.output_text}>{this.props.output_value}</Text>
                </View>
              
            
            <View style={styles.chatbot}>
                <Text style={styles.chat_text}>{this.props.comment}</Text>
            </View>
            
        </View>
    )
  }
}


class CalcKeyBoard extends Component{
  render(){
    return(

       <View style={styles.my_board}>

        <View style={styles.container}>
        
          <View style={styles.num_container}>          
              <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'('}/>
              <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={')'}/>
              <CalButton push_values={this.props.back_space} view_style={styles.num_button} op_style={styles.butt_text} symbol={<Icon name='arrow-left' size={20} color="white"/>} />
          </View>

         <View style={styles.num_container}>          
           <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'7'}/>
           <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'8'}/>
           <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'9'}/>
         </View>

        <View style={styles.num_container}>          
          <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'4'}/>
          <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'5'}/>
          <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'6'}/>
        </View>

        <View style={styles.num_container}>  
            <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'3'}/>
            <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'2'}/>
            <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'1'}/>
        </View>

        <View style={styles.num_container}>          
           <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'0'}/>
           <CalButton push_values={this.props.push_values} view_style={styles.num_button} op_style={styles.butt_text} symbol={'.'}/>
           <CalButton push_values={this.props.all_clear} view_style={styles.num_button} op_style={styles.butt_text} symbol={'AC'}/>
        </View>     

      </View>


        <View style={styles.operator_container}>
           <CalButton push_values={this.props.push_values} view_style={styles.op_button} op_style={styles.op_text} symbol={'/'}/>
           <CalButton push_values={this.props.push_values} view_style={styles.op_button} op_style={styles.op_text} symbol={'*'}/>
           <CalButton push_values={this.props.push_values} view_style={styles.op_button} op_style={styles.op_text} symbol={'+'}/>
           <CalButton push_values={this.props.push_values} view_style={styles.op_button} op_style={styles.op_text} symbol={'-'}/>
           <CalButton push_values={this.props.calculate} view_style={[styles.op_button,styles.equals_button]} op_style={[styles.op_text,{marginTop: '10%'}]} symbol={'='}/>
        </View>
      
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    
  },
  tab:{
    flex:1,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignSelf: 'flex-start', 
    width: '100%',
    maxHeight: '5%',
    maxWidth: '100%',
    backgroundColor: 'steelblue',
  },
  pre_title:{
    color:'pink',
    fontWeight: 'bold',
    fontSize: 15,
    elevation: 2
  },
  title:{    
    color:'white',
    fontWeight: 'bold' ,
    fontSize:15, 
  },
  workbench:{
    flex:1,
    maxHeight: '30%',
    width: '100%',
    backgroundColor: 'black'
  },
  my_board:{
    flex:1,
    height: '100%',
    width: '100%',
    backgroundColor: 'steelblue',
    flexDirection: 'row', 


  },
  num_button:{
    flex:1,
    maxHeight: '80%',
    maxWidth: '100%',
    margin:'3%',
    backgroundColor: 'steelblue',
    elevation: 4,
    borderRadius: 100,
  },
  butt_text:{
    color:'white',
    fontWeight:'bold',
    alignSelf: 'center',
    fontSize: 15,
    marginTop: '25%' 
  },
  operator_container:{
    flex:1,
    flexDirection: 'column', 
    maxHeight: '100%',
    maxWidth: '25%',
    backgroundColor: '#325d81',
    elevation: 10,
    
  },
  op_button:{
    flex:2,
    maxHeight: '20%',
    width: '100%',
    elevation: 10,

  },
  op_text:{
    color:'white',
    fontWeight:'bold',
    alignSelf: 'center',
    fontSize: 30,
    marginTop: '15%',
  },
  num_container:{
    flex:1,
    flexDirection: 'row',
    maxHeight: '20%',
    width:'100%',
  },
  output:{
    flex:1,
    maxHeight: '30%',
    width: '100%',
   
  },
  output_text:{
    fontSize: 50,
    color:'white',
    marginTop:'3%',
    textAlign: 'right',
    
  },
  input_text:{
    fontSize: 30,
    color:'white',
    textAlign: 'right',
    marginTop: '5%'
  },
  chatbot:{
    flex:1,
    borderTopColor: 'white',
    borderTopWidth: 0.5,
    maxHeight: '1%',
    width: '100%',
    alignSelf: 'baseline', 
    marginTop:'10%'
  },
  chat_text:{
    color:'white',
    fontSize:15,
    textAlign: 'right',
    marginTop: '2%', 
  },
  equals_button:{
    backgroundColor: '#ff1493',
    borderRadius: 100,
    maxHeight: '15%',
    maxWidth: '63%',
    elevation: 5,
    marginLeft: '20%',
    marginTop: '7%'
  }

  
 });
