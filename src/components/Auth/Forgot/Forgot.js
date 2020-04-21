import React from "react";

export function renderDOM(DOM, handleChange) {
  return DOM.map(
    (
      {
        className,
        label,
        input: { name, type, className: inputClassName, placeholder },
      },
      idx
    ) => {
      return (
        <div className={className} key={idx}>
          <label>{label}</label>
          <input
            name={name}
            onChange={handleChange}
            type={type}
            className={inputClassName}
            placeholder={placeholder}
          />
        </div>
      );
    }
  );
}

export const showMessage = (message) => {
  const elem = document.getElementById("info");
  elem.innerHTML = message;
  elem.style.display = "block";
};
