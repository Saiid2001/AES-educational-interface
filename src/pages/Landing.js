import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLock, faMountain, faKey} from "@fortawesome/free-solid-svg-icons"
import {VerticalGroup} from "../components/layouts"

class LandingButton extends React.Component{
    render(){
        return <button className='landing-button'>
            <div className='blue-rectangle'>
            </div>
            <div className='content'>
            <FontAwesomeIcon icon={this.props.icon} />{this.props.text}</div>
        </button>
    }
}

class Landing extends React.Component{
    render(){
        return <div className='landing'>
            <div className='content'>
            <div className='title'>
                <h1>AES</h1>
                <h2>Educational Tool</h2>
            </div>
            <VerticalGroup>
                <LandingButton icon={faLock} text="Encryption/Decryption"/>
                <LandingButton icon={faMountain} text="Avalanche"/>
                <LandingButton icon={faKey} text="Key Expansion"/>
            </VerticalGroup> 
            </div>
        </div>
    }
}

export default Landing;