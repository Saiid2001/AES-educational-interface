import React from "react";

class VerticalGroup extends React.Component{
    render(){
        return <div className='vertical-group'>
            {this.props.children}
        </div>
    }
}

export {VerticalGroup}