import * as React from "react";
import { TrixEditor } from "react-trix";
import "trix";

class Editor extends React.Component {
  handleEditorReady(editor) {
    console.log("Editor ready!")
  }
  handleChange(html, text) {
    
  }
  render() {
    return (
      <div>
        <trix-toolbar id="trix-toolbar"></trix-toolbar>
        <TrixEditor onChange={this.handleChange} onEditorReady={this.handleEditorReady} id="trixEditorContent" className="trix-editor" toolbar="trix-toolbar" />
      </div>
    );
  }
}

export default Editor;