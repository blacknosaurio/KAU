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
  const [positions, setPositions] = useState()
  const [dragged, setDragged] = useState(null)
  const [tries, setTries] = useState(false)
  const [success, setSuccess] = useState(false)
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
    const positions = items.map(el => el.position)
    setPositions(items.map(el => el.position))
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


  const checkPositions = (l1, r1, l2, r2) => (r1.y >= l2.y && r2.y >= l1.y && r1.x >= l2.x && r2.x >= l1.x)

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

    ev.target.addEventListener('mousemove', dragEl, false);

    window.addEventListener('mouseup', function (ev) {

      ev.target.removeEventListener('mousemove', dragEl, false);
    }, false);

  }

  const mouseOver = ev => {
    const over = ev.currentTarget
    const n = Number(ev.currentTarget.dataset.id)

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

    items.forEach((el, i) => {
      if (i !== n) refs.current[i].current.style.opacity = (isOver(items[n], items[i])) ? '0.5' : '1'
    })

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


  const getStyle = i => {
    // To be removed...
    return {
      'position': 'absolute',
      'left': `${positions[i].x}%`,
      'top': `${positions[i].y}%`,
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
              style={getStyle(i)}
              src={item.path}
              data-id={i}
              key={i}
              title={item.name}
              onTouchStart={touchStart}
              onMouseDown={mouseDown}
              onTouchStart={touchStart}
              onMouseMove={mouseOver}
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