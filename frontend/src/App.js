import React, { useEffect, useState, useRef } from 'react';
import './App.css';

import { Container, Paper, Grid } from '@material-ui/core';


import OkdbClient from "okdb-client";
import cloneDeep from 'lodash/cloneDeep';

import OkdbSpreadsheet from 'okdb-spreadsheet';
import "okdb-spreadsheet/lib/styles.css";
import MousePointer from './MousePointer';

// location of your server
const HOST = "localhost:7899";
// token for user authentication, handled by the auth handler on the server side
const TOKEN = "12345";
const okdb = new OkdbClient(HOST);

// data type, typically corresponds to the table name
const DATA_TYPE="todo-tasks"; 
// id of the object to be edited collaboratively
const DOCUMENT_ID = "spreadsheet-1"; 

const initialGrid = [
  [
    { readOnly: true, value: '' },
    { value: 'Expences', readOnly: true },
    { value: 'Q1', readOnly: true },
    { value: 'Q2', readOnly: true },
    { value: 'Q3', readOnly: true },
    { value: 'Q4', readOnly: true },
  ],  
];

const expences = [
  "Accounting",
  "Advertising",
  "Hardware",
  "Insurance",  
  "Office Supplies",
  "Office Rent",
  "Payroll Expenses",
  "Software Licenses",
  "Telephone",
  "Travel",
  "Web hosting",
  

];
for(let i = 0; i < 15; i++) {
  initialGrid.push([
    { readOnly: true, value: i+1 },
    { value: expences[i]? expences[i] : ""},
    { value: ""},
    { value: ""},
    { value: ""},
    { value: ""},
  ])
}

initialGrid.push([
  { readOnly: true, value: 16 },
  { value: "Total:",readOnly: true},
  { value: 0, readOnly: true},
  { value: 0, readOnly: true},
  { value: 0, readOnly: true},
  { value: 0, readOnly: true},
])

const calculateTotals = (grid) => {
  const totalRow = grid[grid.length-1];
  for(let i = 2; i < totalRow.length; ++i) {
    let sum = 0;
    for(let j = 1; j < grid.length-1; ++j) {      
      const value = parseFloat(grid[j][i].value);
      if(value) sum += value;
    }
    totalRow[i].value = sum;
  }
}

function App() {  
  const [user, setUser] = useState(null);
  const connectedRef = useRef(false);
  // online status and cursor/selections of other participants
  const [presences, setPresences] = useState({});
  // spreadsheet data
  const [grid, setGrid] = useState(null);

  // cell selection saved locally
  const [localSelection, setLocalSelection] = useState({});
  // mouse position saved locally
  const [localMouse, setLocalMouse] = useState({});

  // callback to receive data changes from others
  const updateCallback = (data, meta) => {             
    const newData = cloneDeep(data);
    calculateTotals(newData);
    setGrid(newData);
  }

  // callback to recieve status changes of other collaborators
  const presenceCallback = (id, data) => {    
    if(!data) {
      setPresences(prev => {        
        const newState = cloneDeep(prev);
        delete newState[id];
        return newState;
      })
    } else if(data.user && data.user.id) {
      setPresences(prev => {
        const index = Object.keys(prev).findIndex(item => item === id);
        const colors = [ "#5552FF", "#0FA956"];
        const colorIdx = index%colors.length;
        const color = colors[colorIdx];        
        const newState = cloneDeep(prev);             
        newState[id] = {
          id,
          color,
          ...data
        };
        return newState;
      });
    }
  };
  
  useEffect(() => {
    // 1. step - connect
    okdb.connect(TOKEN)
      .then(user => {
        console.log("[okdb] connected as ", user);
        setUser(user);
        // 2. step - open document for collaborative editing        
        okdb.open(
            DATA_TYPE, // collection name
            DOCUMENT_ID,
            initialGrid, // default value to save if doesn't exist yet
            updateCallback, 
            presenceCallback
          )
          .then(data => { 
            // get the data once the doc is opened
            console.log("Loaded doc from server ", data);    
            connectedRef.current = true;        
            calculateTotals(data);
            setGrid(data);
          })
          .catch(err => { console.log("Error opening doc ", err)});
      })
      .catch(err => {
        console.error("[okdb] error connecting ", err);
      });
  }, []);

  useEffect(() => {
    const handler = e => { 
      const container = document.querySelector("#okdb-table-container");   
      if(!container) return;             
      const containerRect = container.getBoundingClientRect();  
      var left = e.clientX - containerRect.left;
      var top = e.clientY - containerRect.top;      
      const mousePos = {        
        left,
        top,
      };
      setLocalMouse(mousePos);
      if(connectedRef.current) {
        okdb.sendPresence({
          ...mousePos,
          ...localSelection
        });
      }
    };
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
    }
  }, [localSelection]);


  const updateDoc = (newDoc) => {
    if(connectedRef.current) {
      okdb.put(DATA_TYPE, DOCUMENT_ID, newDoc)
      .then(res => {
        console.log("doc saved, ", res);      
      })
      .catch((err) =>  console.log("Error updating doc", err));
    }
  };

  const otherSelections = Object.keys(presences)
                                .map(presenceId => presences[presenceId])
                                .filter(item => 'start' in item && "end" in item);
   
  return (
    <Container maxWidth="md" className="container">
      <Grid container spacing={3}>        
        <Grid item md={9}>
          <h1>Collaborative Work in Spreadsheets</h1>
          <p key="p1">Open this page twice, for example on your computer and on the phone.</p>
          { grid && 
            <Paper >
              <div id="okdb-table-container">
                <h3>2021 Budget</h3>
              <OkdbSpreadsheet
                data={grid}
                valueRenderer={cell => cell.value}
                overflow="clip"
                onCellsChanged={changes => {
                  const newGrid = grid.map(row => [...row]);
                  changes.forEach(({ cell, row, col, value }) => {
                    newGrid[row][col] = { ...grid[row][col], value };
                  });
                  calculateTotals(newGrid);
                  setGrid(newGrid);
                  updateDoc(newGrid);
                }}
                selections={otherSelections}
                onSelect={(selection) => {         
                  setLocalSelection(selection);
                  if(connectedRef.current) {
                    okdb.sendPresence({
                      ...selection,
                      ...localMouse
                    });
                  }
                }}
              />
              </div>
            </Paper>
          }
          
          
        </Grid>
        <Grid item md={3}>
          <div className="online-panel">
            <h4>Online:</h4>
            <div className="online-item" key="000">
              <svg width="10" focusable="false" viewBox="0 0 10 10" aria-hidden="true" title="fontSize small"><circle cx="5" cy="5" r="5"></circle></svg>
              me ({user ? user.name : "connecting..."})
            </div>
            {Object.keys(presences).map((presenceId, index) => {              
              const presence = presences[presenceId];              
              let left = 0;
              let top = 0;
              if(presence.left != null) {
                const container = document.querySelector("#okdb-table-container");   
                if(container) {
                  const containerRect = container.getBoundingClientRect();                
                  top = containerRect.top + presence.top + window.scrollY + "px";
                  left = containerRect.left + presence.left + window.scrollX + "px";
                }                
              }
              const colors = [ "#5551FF", "#0FA958"];
              const userColor = colors[index%colors.length];
              return (
              <div className="online-item" key={presenceId}>
                <svg width="10" fill={userColor} focusable="false" viewBox="0 0 10 10" aria-hidden="true" title="fontSize small"><circle cx="5" cy="5" r="5"></circle></svg>
                {presence.user.name}
                { presence.left != null &&
                  <div id="cursor" className="cursor-block" style={{left, top}}>
                    <MousePointer color={presence.color} />
                    <div className="cursor-name-container">
                      <div className="cursor-name" style={{backgroundColor: presence.color}}>{presence.user.name}</div>
                    </div>
                  </div>
                }
              </div>              
              );
            })}
          </div>
        </Grid>  
      </Grid>
      
    </Container>
  );
}

export default App;
