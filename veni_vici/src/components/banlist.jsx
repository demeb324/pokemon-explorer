import React from "react";

const BanList = ({ banList, onRemove }) => {
    return (
        <div className="ban-list">
          <h2 className="text-xl font-semibold">Ban List:</h2>
          {banList.length === 0 ? (
            <p className="text-gray-600">No banned attributes</p>
          ) : (
            <ul className="ban-list-items">
              {banList.map((attr, index) => (
                <li
                  key={index}
                  className="ban-list-item"
                  onClick={() => onRemove(attr)}
                >
                  {attr} <span className="remove-icon">×</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
}

export default BanList;