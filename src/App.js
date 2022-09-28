import './App.css';
import "trix";
import "trix/dist/trix.css";

import { TrixEditor } from "react-trix";

import SaveButton from './components/save';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>JSRamverk Editor</h1>
      </header>
      <div className="App-editor">
        <div className="App-toolbar">
          <SaveButton></SaveButton>
        </div>
        <TrixEditor id="trixEditorContent" className="trix-editor" toolbar="trix-toolbar"></TrixEditor>
      </div>
      <footer className="App-footer">
        <h3>JSRamverk Editor : Mikael Menonen</h3>
      </footer>
    </div>
  );
}

export default App;
