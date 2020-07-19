import React from 'react';
import ReactDOM from 'react-dom';
import DragDrop from './components/dragDrop'
import { juego } from './constants/game1'
import './index.css';



const MainApp = () => {

  return (
    <div>
      <DragDrop data={juego}/>
    </div>
  );
};


ReactDOM.render(
  <MainApp />,
  document.getElementById('root')
);
