import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef
} from 'react'
import axios from 'axios'
import useEventListener from './useEventListener'

export default function ({
  ...props
}) {

  const pathIMG = 'assets/'

  const [items, setItems] = useState([])
  const [obj, setObj] = useState({
    ...props
  })
  const [dragging, setDragging] = useState(undefined)
  // const [positions, setPositions] = useState()
  const [dragged, setDragged] = useState(null)
  const [tries, setTries] = useState(false)
  const [success, setSuccess] = useState(false)
  const [overs, setOvers] = useState([])

  const [coords, setCoords] = useState({
    x: 0,
    y: 0
  });
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight
  })
  let refs = useRef([]);

  useEffect(() => {
    const end = {
      x: null,
      y: null
    }
    const init = {
      x: null,
      y: null
    }
    console.log('Props value changed ', obj)
    const {
      items
    } = obj.data
    // const positions = items.map(el => el.position)
    // setPositions(items.map(el => el.position))
    asyncItems(items)
    setTries(obj.data.tries)
    setSuccess(obj.data.solution)
    window.dispatchEvent(new Event('resize'));
    refs.current = Array(items.length).fill().map((_, i) => refs.current[i] || createRef())

    items.forEach((el, index) => el.itCoords = {
      init: getInitPosition(el.position),
      end: getEndPosition(el)
    })
    console.log(items)

    return () => {
      // TODO Something
    }
  }, [obj])

  const percentToabsolute = ({
    x,
    y
  }) => {
    return {
      x: (size.w / 100) * x,
      y: (size.h / 100) * y
    }
  }

  const getInitPosition = coords => {
    return percentToabsolute(coords)
  }

  const getEndPosition = ({
    position,
    size
  }) => {
    const {
      x,
      y
    } = percentToabsolute(position)
    const {
      w,
      h
    } = size
    return {
      x: x + w,
      y: y + h
    }
  }

  const clickOver = stateToToggle => {
    console.log(stateToToggle)
  }

  const sort = (list, dragging) => {
    setItems(list);
    setDragging(dragging);
  }

  useEffect(() => {
    console.log('Has sumado otro intento ', tries)
    if (tries && tries > -1) {
      setTries(tries - 1)
    } else if (tries === 0) {
      alert('Has superado el número de intentos')
    }
    return () => {
      // TODO Something
    }
  }, [items])

  useEffect(() => {
    if (success < 0) {
      alert('Felicidades, has completado este reto!!')
    }
    return () => {
      // TODO Something
    }
  }, [items])

  const swapElements = (x, y) => {
    const a = x > y ? y : x;
    const b = x > y ? x : y;
    return [
      ...items.slice(0, a),
      items[b],
      ...items.slice(a + 1, b),
      items[a],
      ...items.slice(b + 1),
    ];
  }

  // These 2 functions will get the success & error actions
  const getSuccess = success => {
    console.log('ok', success)
  }

  const getError = err => {
    console.log('ko', err)
  }


  const checkPositions = (l1, r1, l2, r2) => {
    if (r1.y >= l2.y && r2.y >= l1.y && r1.x >= l2.x && r2.x >= l1.x) {
      // We get all the interactions between the areas to determinate the overlayed size when two or more target areas are under the source area
       return ([r1.y - l2.y, r2.y - l1.y, r1.x - l2.x, r2.x - l1.x].sort((a, b) => a - b).splice(0, 2).reduce((a,b) => a + b, 0))
    }
    return 0
  }


  const isOver = (a, b) => {
    // We build a class Point to set the coordinates
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }
    const l1 = new Point(a.itCoords.init.x, a.itCoords.init.y)
    const r1 = new Point(a.itCoords.init.x + a.size.w, a.itCoords.init.y + a.size.h)
    const l2 = new Point(b.itCoords.init.x, b.itCoords.init.y)
    const r2 = new Point(b.itCoords.init.x + b.size.w, b.itCoords.init.y + b.size.h)

    return checkPositions(l1, r1, l2, r2)
  }


  const screenResized = ({
    target: {
      innerWidth,
      innerHeight
    }
  }) => {
    setSize({
      w: innerWidth,
      h: innerHeight
    })
  }

  useEffect(() => {
    console.log('info screen size updated! ', size)
    return () => {
      // TODO Something
    }
  }, [size])

  useEffect(() => {
    overs.forEach((el, n) => {
      if (el !== 0) {
        refs.current[n].current.className = Math.max(...overs) === el ? 'overOk' : 'overKo'
      } else
      refs.current[n].current.className = 'default'
    })
    return () => {
      // TODO Something
    }
  }, [overs])



  const handler = useCallback(
    ({
      clientX,
      clientY
    }) => {
      // This is ready to draw when moving finger or mouse over the screen
      setCoords({
        x: clientX,
        y: clientY
      });
    },
    [setCoords]
  );

  // Currently commented until draw feature is ready
  // useEventListener('mousemove', handler);
  // useEventListener('touchmove', handler);
  useEventListener('resize', screenResized);

  const mouseDown = ev => {

    ev.preventDefault();

    const n = Number(ev.currentTarget.dataset.id)
    setDragging(n)
    ev.preventDefault();

    setDragged(n)

    ev.target.addEventListener('mousemove', dragEl, false);

    window.addEventListener('mouseup', function (ev) {

      ev.target.removeEventListener('mousemove', dragEl, false);
    }, false);

  }

  const mouseOver = ev => {

    const over = ev.currentTarget
    const n = Number(ev.currentTarget.dataset.id)

    console.log(items[n].name)

    items[n].itCoords = {
      init: {
        x: ev.target.offsetLeft,
        y: ev.target.offsetTop
      },
      end: {
        x: ev.pageX,
        y: ev.pageY
      }
    }
    let arr = []
    items.forEach((el, i) => {

      if (i !== n) {
        const size = isOver(items[n], items[i])
          // refs.current[i].current
        arr.push(size)
      } else arr.push(0)
    })
    setOvers(arr)
  }

  const mouseLeave = ev => {
    const n = Number(ev.currentTarget.dataset.id)
    console.log('leave ', n, dragged)
    if (n === dragged) {
      setDragged(null)
      if (overs.every(el => el === 0)) {
        gotToPreviousPoint(n)
      } else {
        console.log(n, overs[0])
        // setItems([...(swapElements(n, overs[0]))])
        // gotToPreviousPoint(n)
      }
      setOvers([])
    }
    else {

      console.log('nada que hacer aquí')
    }

  }

  const gotToPreviousPoint = n => {
    const { x, y } = percentToabsolute(items[n].position)
    refs.current[n].current.style.left = x + 'px'
    refs.current[n].current.style.top = y + 'px'
  }


  document.addEventListener('touchmove', e => e.preventDefault, {
    passive: false
  });

  const touchStart = ev => {
    ev.preventDefault();
    const n = Number(ev.currentTarget.dataset.id)
    const touch = ev.touches;
    setDragging(n)

    items[n].itCoords = {
      init: {
        x: ev.target.offsetLeft,
        y: ev.target.offsetTop
      },
      end: {
        x: touch[0].pageX,
        y: touch[0].pageY
      }
    }

    function preventBehavior(ev) {
      ev.preventDefault();
      swipEl(ev);
      const n = Number(ev.currentTarget.dataset.id)
      const touch = ev.touches;
      setDragging(n)

      items[n].itCoords = {
        init: {
          x: ev.target.offsetLeft,
          y: ev.target.offsetTop
        },
        end: {
          x: touch[0].pageX,
          y: touch[0].pageY
        }
      }

      items.forEach((el, i) => {
        if (i !== n) refs.current[i].current.style.opacity = (isOver(items[n], items[i])) ? '0.5' : '1'
      })
    };

    ev.target.addEventListener('touchmove', preventBehavior, {
      passive: false
    });

    window.addEventListener('touchend', function (ev) {
      ev.preventDefault();
      ev.target.removeEventListener('touchmove', swipEl, false);
    }, false);
  }

  const dragEl = ev => {
    // This is for desktop devices
    const n = Number(ev.currentTarget.dataset.id)
    ev.target.style.left = items[n].itCoords.init.x + ev.pageX - items[n].itCoords.end.x + 'px';
    ev.target.style.top = items[n].itCoords.init.y + ev.pageY - items[n].itCoords.end.y + 'px';
    ev.target.style.zIndex = 10;

  }

  const swipEl = ev => {
    // This is for mobile & tablet devices
    const contact = ev.touches;
    const n = Number(ev.currentTarget.dataset.id)
    ev.target.style.left = items[n].itCoords.init.x + contact[0].pageX - items[n].itCoords.end.x + 'px';
    ev.target.style.top = items[n].itCoords.init.y + contact[0].pageY - items[n].itCoords.end.y + 'px';
  }

  const getActions = (from, to) => {
    if (items[from].role === 0 && items[to].role === 1) {
      if (items[from].linkedTo.indexOf(items[to].id) !== -1) {
        // TODO => success action
        setSuccess(success - 1)
      } else {
        // TODO => error action
      }
    }
    // Not allowedd acions!!!
    // ----------------------------------------->
    if (items[from].role === 0 && items[to].role === 0) {
      // Source & target = questions
    }
    if (items[from].role === 1 && items[to].role === 1) {
      // Source & target = answers
    }
    if (items[from].role === 1 && items[to].role === 0) {
      // Source = answer & target = question
    }
    // ----------------------------------------->
  }

  const dragStart = ev => {
    // Not compatible with touch screens :(
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text/html", null);
  }

  const dragEnd = ev => {
    // Not compatible with touch screens :(
    const over = ev.currentTarget
  }

  const dragLeave = ev => {
    // Not compatible with touch screen seven :(
    ev.preventDefault();
    const over = ev.currentTarget
    const from = isFinite(dragging) ? dragging : dragged;
    let to = Number(over.dataset.id);
    if (from !== to) {
      getActions(from, to)
      setItems([...(swapElements(from, to))])
      setDragging(dragging);
    }
  }

  const dragEnter = ({
    // Not compatible with touch screens :(
    position: {
      x,
      y
    },
    ...props
  }) => {
    // console.log(x, y, props)
  }


  const getStyle = ({ position: { x, y }}) => {
    // To be removed...
    return {
      'position': 'absolute',
      'left': `${x}%`,
      'top': `${y}%`,
      'width': '140px',
      'height': '120px'
    }
  }

  const asyncItems = async (items) => {
    // We get local images from the project and load them asynchronously
    setItems([...await Promise.all(
      items.map(async item => await axios.get(`${pathIMG + '' + item.path}`, {
          responseType: 'arraybuffer'
        })
        .then(response => {
          return {
            ...item,
            path: `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`
          }
        }))
    )])
  }

  return (
    <div>
        <ul className="columns">
          {
          items.map((item, i) => {
            return <img className={dragging}
              ref={refs.current[i]}
              style={getStyle(item)}
              src={item.path}
              data-id={i}
              key={i}
              title={item.name}
              className='default'
              onTouchStart={touchStart}
              onMouseDown={mouseDown}
              onMouseMove={mouseOver}
              onMouseLeave={mouseLeave}
              onTouchStart={touchStart}
              draggable={item.draggable}
              onDragStart={dragStart}
              onDragLeave={dragLeave}
              onDragEnter={() => dragEnter}
              onDragEnd={dragEnd}>
           </img>;
           })
        }
        </ul>
      </div>
   )
}