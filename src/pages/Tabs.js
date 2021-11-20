import React from "react";
import Encryption from "./Encryption";
import Avalanche from "./Avalanche";
import KeyExpansion from "./KeyExpansion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLock, faMountain, faKey} from "@fortawesome/free-solid-svg-icons"


class TabHeader extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return <button className={this.props.selected? 'tab-header selected':'tab-header'} onClick={this.props.onClick}>
            <FontAwesomeIcon icon={this.props.icon} />{this.props.text}
        </button>
    }
}

class TabHeaders extends React.Component{

    constructor(props){
        super(props)
        this.state = {index: props.index}
    }

    tabClicked(index){
        this.props.onIndexChange(index);
        this.setState({"index":index})
    }

    render(){

        let tabs = [
            <TabHeader icon={faLock} text="Encryption/Decryption" onClick={()=>{this.tabClicked(0)}} selected={this.state.index===0} key={0}/>,
            <TabHeader icon={faMountain} text="Avalanche" onClick={()=>{this.tabClicked(1)}} selected={this.state.index===1} key={1}/>,
            <TabHeader icon={faKey} text="Key Expansion" onClick={()=>{this.tabClicked(2)}} selected={this.state.index===2} key={2}/>
        ]

        return <div className='tab-headers'>
            <h2 className='title' onClick ={this.props.onBackClick}>AES</h2>

            <div className='buttons'>
                {tabs}
            </div>
        </div>;
    }
}

class Tabs extends React.Component{

    constructor(props){
        super(props);
        this.onIndexChange = this.onIndexChange.bind(this);
        this.state = {
            index: props.tab-1,
            _this: this
        };
    }

    onIndexChange(index){

        this.setState({"index": index})
    }

    render(){


        const page = ()=>{
        switch (this.state.index) {
            case 0:
                return <Encryption/>;

            case 1:
                return <Avalanche/>;

            case 2:
                return <KeyExpansion/>;
        
            default:
                return <Encryption/>;
        }
    }

    return <div className='tabs'>
        <TabHeaders onIndexChange = {this.onIndexChange} index={this.state.index} onBackClick={()=>{this.props.onTab(0)}}/>
        {page()}
    </div>

}
}


export default Tabs;

