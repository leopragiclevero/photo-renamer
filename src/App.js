import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const {app} = window.require('electron').remote;
// let folderPath = '/Users/leopragi/Downloads';
let path = window.require('path');
let fs = window.require('fs');


function readPhotoFiles(directory, filter){
  let photoFiles = []
  if (!fs.existsSync(directory)){
      console.log("no dir ",directory);
      return [];
  }
  let fileNames = fs.readdirSync(directory);
  for(let fileName of fileNames) {
    let filePath = path.join(directory, fileName);
    let stat = fs.lstatSync(filePath);
    if (!stat.isDirectory() && filter.test(filePath)){
      photoFiles.push(filePath)
    }
  }
  return photoFiles
};


class App extends Component {

  state = {
    currentIndex: 0,
    files: [],
    folderPath: null,
    folderPathSet: false,
    buttons: [
      'ELEPHANT_',
      'DEER_',
    ]
  }

  readFiles = () => {
    let files = readPhotoFiles(this.state.folderPath,/\.jpg$/)
      .map(filePath => ({
        path: filePath,
        name: filePath.substring(filePath.lastIndexOf('/') + 1)
      }));
    this.setState({files})
  }

  handleClick = (event) => {
    let {files, currentIndex} = this.state;
    let {path, name} = files[currentIndex]
    let pathAlone = path.substring(0, path.lastIndexOf('/')) 
    fs.renameSync(path, `${pathAlone}/${event.target.value}${name}`);
  }

  handleNext = () => {
    let index = this.state.currentIndex
    let newIndex = (index + 1)
    if(newIndex >= this.state.files.length) {
      return
    }
    this.setState({currentIndex: newIndex})
  }

  handlePrev = () => {
    let index = this.state.currentIndex
    let newIndex = index - 1
    if(newIndex < 0) {
      return
    }
    this.setState({currentIndex: newIndex})
  }

  render() {
    let {files, currentIndex, buttons, folderPath, folderPathSet} = this.state;

    if(!folderPath || !folderPathSet) {
      return (
        <div style={{margin: 10}}>
          Folder path:
          <input value={folderPath} onChange={(e) => this.setState({folderPath: e.target.value})}/>
          <button onClick={() => {
            this.readFiles()
            this.setState({folderPathSet: true});
          }}>Done</button>
        </div>
      )
    }

    return (
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>
          <img src={`file://${files[currentIndex].path}`} style={{maxWidth:'70%'}} />
          <div>{files[currentIndex].name}</div>
        </div>
        <div>
          {buttons.map(button => (
            <div style={{padding: 5}}>
              <input style={{width:'100%', fontSize: 30}} type="button" onClick={this.handleClick} value={button} />
            </div>
          ))}
        </div>
        <div>
            <button style={{height: '100%', fontSize: 30}} onClick={this.handleNext}>skip</button>
            <button style={{height: '100%', fontSize: 30}} onClick={this.handlePrev}>{"<<"}</button>
            <button style={{height: '100%', fontSize: 30}} onClick={this.handleNext}>{">>"}</button>
        </div>
      </div>
    );
  }
}

export default App;
