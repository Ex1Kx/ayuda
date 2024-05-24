import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [nodes, setNodes] = useState([{ text: 'Nodo Principal', x: 400, y: 300, color: 'black' }]);
  const [lines, setLines] = useState([]);
  const [nodeTexts, setNodeTexts] = useState(['', '', '', '', '']);
  const colors = ['red', 'green', 'blue', 'orange'];

  const addNode = (parentIndex, text, color, isArrow, isDashed, direction) => {
    const parent = nodes[parentIndex];
    let newX = parent.x;
    let newY = parent.y;
  
    // Ajustar las posiciones basadas en la dirección
    switch (direction) {
      case 'up':
        newY -= 100;
        break;
      case 'down':
        newY += 100;
        break;
      case 'left':
        newX -= 100;
        break;
      case 'right':
        newX += 100;
        break;
      default:
        break;
    }
  
    const newNode = { text, x: newX, y: newY, color };
    setNodes([...nodes, newNode]);
    setLines([...lines, { from: parentIndex, to: nodes.length, relation: text, isArrow, isDashed }]);
  };

  const exportToPDF = async () => {
    const canvasElement = document.getElementById('canvas');
    const canvas = await html2canvas(canvasElement, {
      scale: 2, // Incrementar la escala para obtener una mayor resolución
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = canvas.width / 2; // Ajustar el ancho del PDF a la mitad del ancho del lienzo
    const pdfHeight = canvas.height / 2; // Ajustar la altura del PDF a la mitad de la altura del lienzo

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('mentefacto.pdf');
  };

  const handleTextChange = (event, index) => {
    const newTexts = [...nodeTexts];
    newTexts[index] = event.target.value;
    setNodeTexts(newTexts);
  };

  const updateMainNode = () => {
    const updatedNodes = [...nodes];
    updatedNodes[0].text = nodeTexts[0];
    setNodes(updatedNodes);
  };

  return (
    
    <div className="App">
        <nav>
      <div class="nav__logo">
        <div>M</div>
        Mentefact Creator
      </div>
      <div class="nav__contact">
        <div class="nav__contact__card">
          <span><i class="ri-phone-line"></i></span>
          <div>
          </div>
        </div>
        <div class="nav__contact__card">
          <span><i class="ri-mail-line"></i></span>
          <div>
            <p>Proyecto creado por</p>
            <h4>Julián Lozada Y Alicia Alayo</h4>
          </div>
        </div>
      </div>
    </nav>
    <header class="header__container">
      <div class="header__image">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/national-technology-day-10843706-8731468.png" alt="header" />
      </div>
      <div class="header__content">
        <h1>¡Bienvenido a <span>Mentefact</span> Creator!</h1>
        <p>
        En Mentefact Creator, transformamos tus ideas en mapas mentales visualmente impactantes y organizados. Nuestro objetivo es ofrecerte una plataforma sencilla e intuitiva para que puedas crear, gestionar y compartir mentefactos, facilitando el proceso de aprendizaje y enseñanza.
        </p>
      </div>
    </header>
      <header className="App-header">
        <div className="input-container">
          <h1>Creacion de mentefactos</h1>
          <input
            type="text"
            value={nodeTexts[0]}
            onChange={(event) => handleTextChange(event, 0)}
            placeholder="Texto del nodo principal"
          />
          <button onClick={updateMainNode}>Actualizar Nodo Principal</button>
        </div>
        {nodeTexts.slice(1).map((text, index) => (
          <div key={index + 1} className="input-container">
            <input
              type="text"
              value={text}
              onChange={(event) => handleTextChange(event, index + 1)}
              placeholder={`Texto del nodo ${index + 1}`}
            />
            <button
              onClick={() =>
                addNode(0, text, colors[index], index === 1, index === 3, ['up', 'down', 'left', 'right'][index])
              }
            >
              Agregar Funcion
            </button>
          </div>
        ))}
        <button class="button" onClick={exportToPDF}>Exportar a PDF<svg fill="currentColor" viewBox="0 0 24 24" class="icon">
    <path clip-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fill-rule="evenodd"></path>
  </svg></button>
        <div id="canvas" className="canvas">
          {nodes.map((node, index) => (
            <div
              key={index}
              className="node"
              style={{ left: node.x - 50, top: node.y - 20, backgroundColor: node.color }}
            >
              {node.text}
            </div>
          ))}
          <svg className="lines">
            {lines.map((line, index) => {
              const fromNode = nodes[line.from];
              const toNode = nodes[line.to];
              return (
                <>
                  <line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={nodes[line.to].color}
                    markerEnd={line.isArrow ? `url(#arrow-${index})` : ''}
                    strokeDasharray={line.isDashed ? '5,5' : '0'}
                  />
                  {line.isDashed && (
                    <text
                      key={`${index}-text`}
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 10}
                      fill={nodes[line.to].color}
                      style={{ fontSize: '12px' }}>
                    </text>
                  )}
                </>
              );
            })}
            <defs>
              {lines.map((line, index) => {
                if (line.isArrow) {
                  return (
                    <marker
                      key={`marker-${index}`}
                      id={`arrow-${index}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill={nodes[line.to].color} />
                    </marker>
                  );
                } else {
                  return null;
                }
              })}
            </defs>
          </svg>
        </div>
      </header>
    </div>
  );
}

export default App;
