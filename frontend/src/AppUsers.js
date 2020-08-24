import React from "react";
import MousePointer from './MousePointer';

const AppUsers = ({ presences }) => {
  return (
    <>
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
    </>
  );
};

export default AppUsers;