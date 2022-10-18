import * as React from "react";
import { TrixEditor } from "react-trix";
import "trix";

class Editor extends React.Component {
  render() {
    return (
      <div>
        <trix-toolbar id="trix-toolbar"></trix-toolbar>
        <TrixEditor onChange={this.props.handleChange} onEditorReady={this.props.handleReady} id="trixEditorContent" className="trix-editor" toolbar="trix-toolbar" />
      </div>
    );
  }
}

export default Editor;