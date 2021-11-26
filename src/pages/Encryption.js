import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote , faKey, faLock, faLockOpen} from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AES from '../algorithm/AES';
//steps
// 0 - initially idle
// 1 - begin encrypt/decrypt

//actions
const actions = [
    'Compute one round', //0
    'Encrypt', //1
    'Decrypt'  //2
]
export const EncryptionStepNames = [
    'Add Round Key',
    'Round 1',
    'Round 2',
    'Round 3',
    'Round 4',
    'Round 5', 
    'Round 6',
    'Round 7',
    'Round 8',
    'Round 9',
    'Round 10'
]

const hexValues = ['0', '1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']

export class TextField extends React.Component{

    constructor(props){
        super(props);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);

        this.state = {
            value: this.props.value,
            counter: this.props.value.length
        }
    }

    handleKeydown(e){

        if(!((hexValues.includes(e.key.toLowerCase()) && this.state.counter<this.props.maxNum)|| ['Backspace','Tab'].includes(e.key))){
            e.preventDefault();
        }

        this.setState({value: e.target.value})
    }

    handleValueChange(e){

        if(this.state.counter==0 && e.target.value.length>0){
            this.props.onNewEntry();
        }

        if(this.state.counter==32 && e.target.value.length<32){
            this.props.onEmpty();
        }

        if( e.target.value.length==this.props.maxNum || e.target.value.length==0){
            console.log(e.target.value.length)
            this.props.onValueChange(e.target.value);
        }

        this.setState({value: e.target.value, counter: e.target.value.length})
        
    }

    render(){
        return <div className='text-field'>{this.props.value?null:null}
            <textarea name={this.props.name} placeholder="Enter Hex Code Here..." onKeyDown={this.handleKeydown} onChange={this.handleValueChange} disabled={this.props.disabled} value={this.props.fixVal?this.props.value:this.state.value}/>
            <div className='counter'>{this.props.fixVal?this.props.value.length:this.state.counter}/{this.props.maxNum}</div>
        </div>
        
    }
}

export class InputView extends React.Component{

    constructor(props){
        super(props);

        this.onNewDataEntry = this.onNewDataEntry.bind(this)
        this.onNewKeyEntry = this.onNewKeyEntry.bind(this)
        this.onDataEntered = this.onDataEntered.bind(this)
        this.onKeyEntered = this.onKeyEntered.bind(this)
        this.onKeyEmptied = this.onKeyEmptied.bind(this)
        this.onDataEmptied = this.onDataEmptied.bind(this)

        this.state= {
            data: this.props.initialValues?this.props.initialValues.data: "",
            key: this.props.initialValues?this.props.initialValues.key:"",
        }
    }

    onKeyEntered(value){
        this.setState({"key":value})
    }
    onDataEntered(value){
        this.setState({"data":value})
    }

    onDataEmptied(){
        this.setState({"data":""})
    }

    onKeyEmptied(){
        this.setState({"key":""})
    }

    onNewKeyEntry(){

    }

    onNewDataEntry(){
        
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
                <TextField  id='data-block' name='data-block' maxNum={32} value = {this.state.data} onNewEntry={this.onNewDataEntry} onEmpty={this.onDataEmptied} onValueChange={(val)=>{this.onDataEntered(val)}}  disabled={this.props.step!=0 || this.state.forceDataOff}  fixVal={this.state.forceDataOff}/>
                <label htmlFor="key-block"><FontAwesomeIcon icon={faKey}/> Key Block</label>
                <TextField id='key-block' name='key-block' maxNum={32} value = {this.state.key} onNewEntry={this.onNewKeyEntry} onEmpty={this.onKeyEmptied} onValueChange={(val)=>{this.onKeyEntered(val)}}  disabled={this.props.step!=0 || this.state.forceKeyOff} fixVal={this.state.forceKeyOff}/>
                
                {/* only for the output */}
                {this.props.step >=1? <div>
                    <label htmlFor="data-block">
                    <FontAwesomeIcon icon={this.props.action==2?faLockOpen: faLock}/> Output</label>
                    <TextField  id='out-block' name='out-block' maxNum={32} value = {this.props.output} onNewEntry={()=>{}} onEmpty={()=>{}} onValueChange={()=>{}}  disabled={true}/>
                    </div>:""
                    }

                {
                this.props.step ==0?
                <div className='action-group'>
                     {this.props.onOneRound?<button className='c-o-r-btn' disabled={!isReady}onClick={(e)=>{e.preventDefault(); this.props.onOneRound(this.state.data, this.state.key)}}>Compute one round</button>:null}
                    
                     {this.props.onDecrypt?<button className='d-btn' disabled={!isReady} onClick={(e)=>{e.preventDefault();this.props.onDecrypt(this.state.data, this.state.key)}}>Decrypt</button>:null}
                     {this.props.onEncrypt?<button className='e-btn' disabled={!isReady}onClick={(e)=>{e.preventDefault();this.props.onEncrypt(this.state.data, this.state.key)}}>Encrypt</button>:null}
                    
                </div>:""}


            </form>
        </div>;
    }
}

class StateRow extends React.Component{

    render(){

        return <tr className='step'>
            <td className='stepName'>[{"\t\t"}{this.props.index}{"\t"}/{"\t"}{this.props.total}{"\t"}] - {this.props.stepName}</td>
            <td>
                <div className='matrix'>
                    {this.props.value}
                </div>
            </td>
        </tr>
    }

}

class KeyRow extends React.Component{

    render(){

        return <tr className='step'>
            <td className='matrix'><b>W{this.props.index<10?"0":""}{this.props.index}{"\t\t"}:</b> {this.props.value}</td>
        </tr>
    }

}

class LogView extends React.Component{

    constructor(props){
        super(props);
        this.handleContinueButtonClick = this.handleContinueButtonClick.bind(this);
        this.handleSkipButtonClick = this.handleSkipButtonClick.bind(this);

        this.state = {
            counter: 1
        }
    }

    handleContinueButtonClick(){
        this.setState((state)=>{return{counter:state.counter+1}})
    }

    handleSkipButtonClick(){
        this.setState({counter: this.props.states.length})
    }

    render(){

        let stepNames=[]
        if(this.props.action == 0){
            stepNames= [
                'Substitute Bytes',
                'Shift Rows',
                'Mix Columns', 
                'Add Round Key'
            ]
        }else{
            stepNames= EncryptionStepNames
        }

        if(this.props.step == 0){
            this.state.counter = 1
        }

        return <div className={this.props.step>=1? 'log-view': 'log-view hidden' }>
            <div className='ScrollView'>
                <table>
                    <tbody>
                    <tr>
                        <th>
                            Step
                        </th>
                        <th>
                            State
                        </th>
                    </tr>
                    {this.props.states.map((val,i) => {if(i<this.state.counter) return <StateRow index={i+1} total={this.props.states.length} stepName=  {stepNames[i]} value={val}/>})}
                    </tbody>
                </table>
            </div>
            <div className='ScrollView'>
                <table>
                    <tbody>
                    <tr>
                        <th>
                            SubKeys
                        </th>
                    </tr>
                    {this.props.subkeys.map((val,i) => {return <KeyRow index = {i} value={val}/>})}
                    </tbody>
                    
                </table>
            </div>
            <span className='buttons'>
            <button onClick={this.handleContinueButtonClick} disabled={this.state.counter == this.props.states.length}>Continue</button>
            <button onClick={this.handleSkipButtonClick} disabled={this.state.counter == this.props.states.length}>Skip</button>
            </span>
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
        let {out, intermediate, subkeys} = AES.encrypt(data, key)
        this.setState({action:1, step:1, input: data, key: key, output:out, intermediate: intermediate, subkeys: subkeys})
    }
    handleDecrypt(data, key){
        let {out, intermediate, subkeys} = AES.decrypt(data, key)
        this.setState({action:2, step:1, input: data, key: key, output:out, intermediate: intermediate, subkeys: subkeys})
    }
    handleOneRound(data, key){
        let subkeys = AES.expandKey(key)
        console.log(subkeys)
        let {out, intermediate} = AES.computeOneRound(data, subkeys)
        this.setState({action:0, step:1, input: data, key: key, output:out, intermediate: intermediate, subkeys: subkeys.map(x=>AES.subkeyToHex(x))})
    }

    handleBackClick(){
        this.setState({ step:0, states:[], intermediate:[], })
    }


    render(){
        return <div className='tab encryption-tab'>
        <InputView step={this.state.step} initialValues={{data: this.state.input, key: this.state.key}} action={this.state.action} onEncrypt={this.handleEncrypt} onDecrypt={this.handleDecrypt} onOneRound={this.handleOneRound} onBackClicked={this.handleBackClick} output={this.state.output}/>
        <LogView step={this.state.step} action={this.state.action} states={this.state.intermediate} subkeys={this.state.subkeys}/>
        </div>
    }
}


export default Encryption;
