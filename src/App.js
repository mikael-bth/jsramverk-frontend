import './App.css';
import "trix/dist/trix.css";

import Editor from './components/editor';
import DocToolbar from './components/doctools';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>JSRamverk Editor</h1>
      </header>
      <div className="App-editor">
        <div className="App-toolbar">
          { DocToolbar() }
        </div>
        <Editor></Editor>
      </div>
      <footer className="App-footer">
        <h3>JSRamverk Editor : Mikael Menonen</h3>
      </footer>
    </div>
  );
}

export default App;
