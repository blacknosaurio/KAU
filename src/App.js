import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Quiz } from './BorrarScreens';

function App() {

  const game = {
    type: "QUIZ",
    question: {
      type: "IMAGE",
      text: "Hola soy una pregunta",
      media: "http://52.50.65.127:8080/uploads/39875853_header_wallpapers_77666084f4.jpeg"
    },
    responses: [
      {
        type: "IMAGE",
        text: "respuesta 1 incorrecta",
        media: "http://52.50.65.127:8080/uploads/1688877_f38faefe70.jpeg",
        correct: false
      },
      {
        type: "IMAGE",
        text: "respuesta 2 correcta",
        media: "http://52.50.65.127:8080/uploads/Canal_2_TCS_f179e1c472.png",
        correct: true
      }
    ]
  }

  return (
    <div className="App">
      {game.type === 'QUIZ' && <Quiz quiz={game} />}
    </div>
  );
}

export default App;
