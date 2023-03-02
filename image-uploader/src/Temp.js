import React from 'react';
import { spawn } from 'child_process';
// var spawn = require('child_process').spawn
// var child = spawn('pwd')

function App() {
  const handleClick = () => {
    // Spawn a child process to run the Python script
    const pythonProcess = spawn('python', ['../temp.py']);

    // Print output from the Python script to the console
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Run Python Script</button>
    </div>
  );
}

export default App;
