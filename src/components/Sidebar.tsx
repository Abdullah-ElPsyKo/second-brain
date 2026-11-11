import { NavLink } from "react-router-dom";

export function Sidebar () {
  return (
    <aside style={{width: '200px', background:'#f0f0f0', padding:'1rem'}}>
      <nav>
        <ul style={{listStyle:'none',padding:0}}>
          <li><NavLink to="/">Brain</NavLink></li>
          <li><NavLink to="/capture">Capture</NavLink></li>
          <li><a href="#">Todo List</a></li>
          <li><a href="#">Timeline</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
};