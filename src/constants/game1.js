//historia -> semanas -> días -> juegos
const media = ''
const text = ''
const background = 'blue'
const draggable = true;
const free = false;
const swap = true;
const juego = {
  type: 'DragDrop',
  items: [
    {
      id: 0, // Identificador único
      role: 0, // Puede ser 0 => Query ||1 => Answer
      name: 'Lobo blanco', // Nombre para identificarlo o alt
      path: 'loboBlanco.png', // Puede ser base64, imagen local o svg
      type: 'IMG', // Tipo (IMG / VIDEO / DIV)
      draggable, // Determina si se puede arrastrar
      free, // Determina si el movimiento es libre (cuanod es true no retorna a su posición)
      swap, // Determina si ha de intercambiarse o no por el target
      position: {
        x: 5, // Esto es en porcentajes
        y: 5
      },
      size: {
        w: 140, // Tamaño en pixeles (se puede cambiar a porcentaje)
        h: 120
      },
      linkedTo: [2, 4, 5, 6] // Esto sólo representa los success
    },
    {
      id: 1,
      role: 0,
      name: 'Lobo negro',
      path: 'loboNegro.png',
      type: 'IMG',
      draggable,
      free,
      swap,
      position: {
        x: 20,
        y: 5
      },
      size: {
        w: 140,
        h: 120
      },
      linkedTo: [3, 4, 6]
    },
    {
      id: 2,
      role: 1,
      name: 'Oveja blanca 1',
      type: 'IMG',
      path: 'ovejaBlanca.jpg',
      action: {
        success: resp => `Has comido una oveja blanca :-)  ${resp}`,
        error: err => `${err}`
      },
      position: {
        x: 5,
        y: 80
      },
      size: {
        w: 140,
        h: 120
      },
    },
    {
      id: 3,
      role: 1,
      name: 'Oveja Negra',
      type: 'IMG',
      path: 'ovejaNegra.jpg',
      action: {
        success: resp => `Has comido una oveja negra :-)  ${resp}`,
        error: err => `${err}`
      },
      position: {
        x: 25,
        y: 80
      },
      size: {
        w: 140,
        h: 120
      },
    },
    {
      id: 4,
      role: 1,
      name: 'Oveja Blanquinegra',
      type: 'IMG',
      path: 'ovejaBlanquinegra.jpg',
      action: {
        success: resp => `Has comido una oveja blanquinegra :-)  ${resp}`,
        error: err => `${err}`
      },
      position: {
        x: 45,
        y: 80
      },
      size: {
        w: 140,
        h: 120
      },
    },
    {
      id: 5,
      role: 1,
      name: 'Oveja Blanca 2',
      type: 'IMG',
      path: 'ovejaBlanca2.jpg',
      action: {
        success: resp => `Has comido una oveja blanca :-)  ${resp}`,
        error: err => `${err}`
      },
      position: {
        x: 65,
        y: 80
      },
      size: {
        w: 140,
        h: 120
      },
    },
    {
      id: 6,
      role: 1,
      name: 'Oveja Blanquinegra 2',
      type: 'IMG',
      path: 'ovejaBlanquinegra2.png',
      action: {
        success: resp => `Has comido una oveja blanquinegra :-)  ${resp}`,
        error: err => `${err}`
      },
      draggable: false,
      position: {
        x: 85,
        y: 80
      },
      size: {
        w: 140,
        h: 120
      },
    }
  ],
  background,
  // previousItem,
  // nextItem,
  // feedbacks,
  // // FeedBack, sera un array de items de tipo valoracion
  solution: 5,
  tries: 10,
  // // Tries, Numero de intentos para pasar al siguiente help
  // helps
  // // Helps, array de items tipo ayudaa
  // // AQUI FALTA EL TEMA DE RANDOMIZAR
}
/*
const dia = {
  media,
  mainChamp,
  data: [juego, juego]
}

const semana = {
  media,
  mainChamp,
  users,
  data: [dia, dia, dia]
}
*/
export {
  juego
}