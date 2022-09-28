import React, { Component  } from "react";

class SaveButton extends Component {
    save() {
        const trixEditor = document.querySelector("trix-editor")
        console.log(trixEditor.innerHTML)
    }

    render() {
        return <input id="save" name="save" value={"Spara"} onClick={this.save}></input>;
    }
}

export default SaveButton;
