import React from "react";
import {TextField} from "./Encryption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import AES from '../algorithm/AES';

class InputView extends React.Component{

    constructor(props){
        super(props);

        this.onNewKeyEntry = this.onNewKeyEntry.bind(this)
        this.onKeyEntered = this.onKeyEntered.bind(this)
        this.onKeyEmptied = this.onKeyEmptied.bind(this)

        this.state= {
            key: this.props.initialValues?this.props.initialValues.key:"",
        }
    }

    onKeyEntered(value){
        this.setState({"key":value})
    }
    onKeyEmptied(){
        this.setState({"key":""})
    }
    onNewKeyEntry(){

    }

    render(){
    

        let isReady =  this.state.key.length!=0;

        return <div className='input-view'>

            <form action="">
                <label htmlFor="key-block"><FontAwesomeIcon icon={faKey}/> Key Block</label>
                <TextField id='key-block' name='key-block' maxNum={32} value = {this.state.key} onNewEntry={this.onNewKeyEntry} onEmpty={this.onKeyEmptied} onValueChange={(val)=>{this.onKeyEntered(val)}}  disabled={this.props.step!=0 || this.state.forceKeyOff} fixVal={this.state.forceKeyOff}/>
                
                {
                this.props.step ==0?
                <div className='action-group'>
                     <button className='e-k-btn' disabled={!isReady} onClick={(e)=>{e.preventDefault(); this.props.onSubmit(this.state.key)}}>Expand Key</button>
                    
                </div>:""}


            </form>
        </div>;
    }
}

class SubKeyView extends React.Component{
    render(){
        return <table class="subkey-view">
            <tbody>
                <tr>
                    <td>
                        W{this.props.offset}
                    </td>
                    <td>
                        {this.props.words[0]}
                    </td>
                </tr>
                <tr>
                    <td>
                        W{this.props.offset+1}
                    </td>
                    <td>
                        {this.props.words[1]}
                    </td>
                </tr>
                <tr>
                    <td>
                        W{this.props.offset+2}
                    </td>
                    <td>
                        {this.props.words[2]}
                    </td>
                </tr>
                <tr>
                    <td>
                        W{this.props.offset+3}
                    </td>
                    <td>
                        {this.props.words[3]}
                    </td>
                </tr>
            </tbody>
        </table>
    }
}
class LogView extends React.Component{
    render(){

        let subkeyViews = []

        if(this.props.subkeys)
             for (let i = 0; i< this.props.subkeys.length; i+=4) {
                subkeyViews.push(<SubKeyView offset={i} words={[this.props.subkeys[i],this.props.subkeys[i+1],this.props.subkeys[i+2],this.props.subkeys[i+3]]}/>)
            }

        return <div className={this.props.step==0?"log-view hidden":"log-view"}>
           {subkeyViews}
        </div>
    }
}

class KeyExpansion extends React.Component{

    constructor(props){
        super(props)

        this.handleExpandKey = this.handleExpandKey.bind(this)

        this.state = {
            step:0
        }
    }

    handleExpandKey(value){
        let out = AES.expandKey(value);
        this.setState({step:1, subkeys:out.map(x=>AES.subkeyToHex(x))})
    }

    render(){
        return <div className='tab key-expansion-tab'>
            <InputView step={this.state.step} onSubmit={this.handleExpandKey}/>
            <LogView step={this.state.step} subkeys={this.state.subkeys}/>
        </div>;
    }
}


export default KeyExpansion;