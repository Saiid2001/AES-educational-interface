import React from "react";
import {InputView, EncryptionStepNames} from './Encryption';
import AES from '../algorithm/AES';
import { min } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLock, faLockOpen, faKey} from "@fortawesome/free-solid-svg-icons";


class SummaryView extends React.Component{
    render(){
        return <div className='summary-view'>
            <div>
                <FontAwesomeIcon icon={faLockOpen}/> <em>{"\t"}{this.props.input}</em>
            </div>
            <div>
                <FontAwesomeIcon icon={faKey}/> <em>{"\t"}{this.props.keyInc}</em>
            </div>
            <div>
                <FontAwesomeIcon icon={faLock}/> <em>{"\t"}{this.props.output}</em>
            </div>
            </div>;
    }
}

class BitMatrix extends React.Component{

    highlight(bits, pos, offset){

        if(pos)
            return [...bits].map((b,i)=>pos.includes(i+offset)?<em>{b}</em>:b)
        else
            return bits
    }

    render(){
        let m = []

        console.log(this.props.bits)
        for(let i =0; i<this.props.bits.length; i+=40){
            let v = []
            for(let j=0; j<40; j+=4){

                if(i+j+3<this.props.bits.length)
                    v.push(this.props.bits[i+j]+this.props.bits[i+j+1]+this.props.bits[i+j+2]+this.props.bits[i+j+3])
            }
            m.push(v)
        }
        return <table>
            <tbody>
            {m.map((row,i)=><tr>{row.map((cell,j)=><td><highlight>{this.highlight(cell,this.props.diff, 40*i+j*4 )}</highlight></td>)}</tr>)}
            </tbody>
        </table>
    }
}

class ComparedRow extends React.Component{

    render(){

        let bsLeft, bsRight, diffs;
        
        bsLeft = AES.hexToBinary(this.props.left)

        if(this.props.right){
            bsRight= AES.hexToBinary(this.props.right)
            diffs = AES.differences(bsLeft, bsRight)
        }

        return <div className='compared-row'>
            <div className='col left-col'>
            <b>{EncryptionStepNames[this.props.index]}</b>
                <BitMatrix bits={bsLeft} diff={diffs}></BitMatrix>
            </div>

            {this.props.right?<div className="diff">
                {diffs.length} diffs
            </div>
            :null}
            {this.props.right? <div className='col right-col'>
            <b>{EncryptionStepNames[this.props.index]}</b>
                <BitMatrix bits={bsRight} diff={diffs}></BitMatrix>
            </div>:null}
            </div>;
    }
}

class SideToSideView extends React.Component{
    render(){

        if(this.props.left){

        
        return <div className={'side-to-side-view opened-'+this.props.opened}>
            <header>
                <SummaryView input={this.props.left.input} keyInc={this.props.left.key} output={this.props.left.out}/>
                {this.props.right?<SummaryView input={this.props.right?this.props.right.input:null} keyInc={this.props.right?this.props.right.key:null} output={this.props.right?this.props.right.out:null}/>:null}
            </header>
            <main>
                <div className='ScrollView'>
                    <div className ='rows'>
                    {this.props.left.intermediate.map((val, i)=><ComparedRow index={i} left={val} right={this.props.right?this.props.right.intermediate[i]:null}/>)}
                    </div>
                </div>
            </main>
        </div>

        }
        return "";
    }
}

class ComparativeInputView extends InputView{
    constructor(props){
        super(props);
        
    }

    render(){

        if(this.props.visible)
            return super.render();
        else
            return "";
    }
}

class OneFieldInputView extends InputView{

    constructor(props){
        super(props)

        super.onNewDataEntry = this.onNewDataEntry.bind(this)
        super.onNewKeyEntry = this.onNewKeyEntry.bind(this)
        super.onDataEntered = this.onDataEntered.bind(this)
        super.onKeyEntered = this.onKeyEntered.bind(this)
        super.onKeyEmptied = this.onKeyEmptied.bind(this)
        super.onDataEmptied = this.onDataEmptied.bind(this)

    }


    onNewDataEntry(){
        console.log(this.props.keyEnk)
        super.setState({key: this.props.keyEnk, forceKeyOff: true})

    }

    onNewKeyEntry(){
        super.setState({data: this.props.data, forceDataOff: true})
    }

    onKeyEntered(value){
        if(value=="")
            super.setState({data: "", forceDataOff: false, key:value})
        else
            super.setState({key:value})
    }

    onDataEntered(value){
        if(value=="")
            super.setState({key:"", forceKeyOff: false})
        else
            super.setState({key:value})
    }

    onDataEmptied(){
        super.setState({key: this.props.keyEnk, forceKeyOff: true, data:""})
    }

    onKeyEmptied(){
        super.setState({data: this.props.data, forceDataOff: true, key: ""})
    }

    render(){

        console.log(super.setState)


        if(this.props.visible)
            return super.render();
        else
            return "";
    }
}

class Avalanche extends React.Component{

    constructor(props){
        super(props);

        this.handleEncrypt1 = this.handleEncrypt1.bind(this)
        this.handleEncrypt2 = this.handleEncrypt2.bind(this)

        this.state = {
            openTabs:0
        }
    }

    handleEncrypt1(data, key){
        let out = AES.encrypt(data, key)
        out.input = data;
        out.key = key;
        this.setState({openTabs:1, output1:out})
    }

    handleEncrypt2(data, key){
        let out = AES.encrypt(data, key)
        out.input = data;
        out.key = key;
        this.setState({openTabs:2, output2: out})
    }

    render(){
        
        return <div className='tab avalanche-tab'>
        <div className={'inputs open-'+this.state.openTabs}>
            <ComparativeInputView visible={this.state.openTabs==0} step={0} action={1} onEncrypt={this.handleEncrypt1}/>
            <OneFieldInputView visible={this.state.openTabs==1} step={0} action={1} onEncrypt={this.handleEncrypt2} data={this.state.output1?this.state.output1.input:""} keyEnk={this.state.output1?this.state.output1.key:""}/>
        </div>
        <SideToSideView opened={this.state.openTabs} left={this.state.output1} right={this.state.output2}/>
        </div>
        ;
    }
}

export default Avalanche;

