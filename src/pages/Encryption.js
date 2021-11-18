import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote , faKey} from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
//steps
// 0 - initially idle
// 1 - begin encrypt/decrypt

//actions
const actions = [
    'Compute one round', //0
    'Encrypt', //1
    'Decrypt'  //2
]

const hexValues = ['0', '1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']

class TextField extends React.Component{

    constructor(props){
        super(props);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.state = {
            value: "",
            counter: 0
        }
    }

    handleKeydown(e){
        console.log(this.props.maxNum)
        if(!((hexValues.includes(e.key.toLowerCase()) && this.state.counter<this.props.maxNum)|| ['Backspace','Tab'].includes(e.key))){
            e.preventDefault();
        }
    }

    handleValueChange(e){

        if(this.state.counter==0 && e.target.value.length>0){
            this.props.onNewEntry();
        }

        if(this.state.counter==32 && e.target.value.length<32){
            this.props.onEmpty();
        }

        if( e.target.value.length==this.props.maxNum){
            this.props.onValueChange(e.target.value);
        }

        this.setState({value: e.target.value, counter: e.target.value.length})
        
    }

    render(){
        return <div className='text-field'>
            <textarea name={this.props.name} placeholder="Enter Hex Code Here..." onKeyDown={this.handleKeydown} onChange={this.handleValueChange} disabled={this.props.disabled}/>
            <div className='counter'>{this.state.counter}/{this.props.maxNum}</div>
        </div>
        
    }
}

class InputView extends React.Component{

    constructor(props){
        super(props);

        this.onKeyEntered = this.onKeyEntered.bind(this)
        this.onDataEntered = this.onDataEntered.bind(this)

        this.state= {
            data: this.props.initialValues.data,
            key: this.props.initialValues.key,
        }
    }

    onKeyEntered(value){
        this.setState({"key":value})
    }
    onDataEntered(value){
        this.setState({"data":value})
    }

    render(){
    

        let isReady = this.state.data.length && this.state.key.length;

        return <div className='input-view'>


            {this.props.step>=1? <header>
                <h2>
                    {actions[this.props.action]}
                </h2>
                <button className="back-btn" onClick={this.props.onBackClicked}> 
                    <FontAwesomeIcon icon={faArrowLeft}/> Back
                </button>
            </header>: ""}


            <form action="">
                <label htmlFor="data-block"><FontAwesomeIcon icon={faStickyNote}/> Data Block</label>
                <TextField  id='data-block' name='data-block' maxNum={32} value = {this.state.data} onNewEntry={()=>{}} onEmpty={()=>{this.onDataEntered("")}} onValueChange={(val)=>{this.onDataEntered(val)}}  disabled={this.props.step!=0}/>
                <label htmlFor="key-block"><FontAwesomeIcon icon={faKey}/> Key Block</label>
                <TextField id='key-block' name='key-block' maxNum={32} value = {this.state.key} onNewEntry={()=>{}} onEmpty={()=>{this.onKeyEntered("")}} onValueChange={(val)=>{this.onKeyEntered(val)}}  disabled={this.props.step!=0}/>
                
                
                {
                this.props.step ==0?
                <div className='action-group'>
                     <button className='c-o-r-btn' disabled={!isReady}onClick={(e)=>{e.preventDefault(); this.props.onOneRound(this.state.data, this.state.key)}}>Compute one round</button>
                    
                    <button className='d-btn' disabled={!isReady} onClick={(e)=>{e.preventDefault();this.props.onDecrypt(this.state.data, this.state.key)}}>Decrypt</button>
                    <button className='e-btn' disabled={!isReady}onClick={(e)=>{e.preventDefault();this.props.onEncrypt(this.state.data, this.state.key)}}>Encrypt</button>
                    
                </div>:""}


            </form>
        </div>;
    }
}

class LogView extends React.Component{
    render(){

        

        return <div className={this.props.step>=1? 'log-view': 'log-view hidden' }>
            <div className='ScrollView'>
                <table>
                    <tr>
                        <th>
                            Step
                        </th>
                        <th>
                            State
                        </th>
                    </tr>
                </table>
            </div>
            <div className='ScrollView'>
                <table>
                    <tr>
                        <th>
                            SubKeys
                        </th>
                    </tr>
                    
                </table>
            </div>
        </div>;
    }
}

class Encryption extends React.Component{

    constructor(props){
        super(props);

        this.handleDecrypt = this.handleDecrypt.bind(this);
        this.handleEncrypt = this.handleEncrypt.bind(this);
        this.handleOneRound = this.handleOneRound.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);

        this.state = {
            step:0,
            action:0,
            input: "",
            key: "",
            output:"",
            subkeys: [],
            intermediate:[]
        };
    }

    handleEncrypt(data, key){
        this.setState({action:1, step:1, input: data, key: key})
    }
    handleDecrypt(data, key){
        this.setState({action:2, step:1, input: data, key: key})
    }
    handleOneRound(data, key){
        this.setState({action:0, step:1, input: data, key: key})
    }

    handleBackClick(){
        this.setState({action:0, step:0})
    }


    render(){
        return <div className='tab encryption-tab'>
        <InputView step={this.state.step} initialValues={{data: this.state.input, key: this.state.key}} action={this.state.action} onEncrypt={this.handleEncrypt} onDecrypt={this.handleDecrypt} onOneRound={this.handleOneRound} onBackClicked={this.handleBackClick}/>
        <LogView step={this.state.step} action={this.state.action}/>
        </div>
        

    }
}


export default Encryption;