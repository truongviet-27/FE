// import React, { useRef, useEffect } from "react";
// import "./dropdown.css";

// const Dropdown = (props) => {
//   const dropdown_toggle_el = useRef(null);
//   const dropdown_content_el = useRef(null);

//   // Tạo và hủy event listener cho việc click ngoài
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdown_toggle_el.current && dropdown_toggle_el.current.contains(e.target)) {
//         dropdown_content_el.current.classList.toggle("active");
//       } else if (dropdown_content_el.current && !dropdown_content_el.current.contains(e.target)) {
//         dropdown_content_el.current.classList.remove("active");
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     // Hủy bỏ event listener khi component unmount
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="dropdown">
//       <button ref={dropdown_toggle_el} className="dropdown__toggle">
//         {props.icon && <i className={props.icon}></i>}
//         {props.badge && <span className="dropdown__toggle-badge">{props.badge}</span>}
//         {props.customToggle && props.customToggle()}
//       </button>
//       <div ref={dropdown_content_el} className="dropdown__content">
//         {props.contentData && props.renderItems
//           ? props.contentData.map((item, index) => props.renderItems(item, index))
//           : null}
//         {props.renderFooter && (
//           <div className="dropdown__footer">{props.renderFooter()}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dropdown;


import React, { useRef, useEffect } from "react";
import "./dropdown.css";

const Dropdown = (props) => {
  const dropdown_toggle_el = useRef(null);
  const dropdown_content_el = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdown_toggle_el.current &&
        dropdown_toggle_el.current.contains(e.target)
      ) {
        dropdown_content_el.current.classList.toggle("active");
      } else if (
        dropdown_content_el.current &&
        !dropdown_content_el.current.contains(e.target)
      ) {
        dropdown_content_el.current.classList.remove("active");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown">
      <button ref={dropdown_toggle_el} className="dropdown__toggle">
        {props.icon && <i className={props.icon}></i>}
        {props.badge && <span className="dropdown__toggle-badge">{props.badge}</span>}
        {props.customToggle && props.customToggle()}
      </button>
      <div ref={dropdown_content_el} className="dropdown__content">
        {props.contentData && props.renderItems
          ? props.contentData.map((item, index) => props.renderItems(item, index))
          : <div className="dropdown__no-content">Không có thông tin</div>}
        {props.renderFooter && (
          <div className="dropdown__footer">{props.renderFooter()}</div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
