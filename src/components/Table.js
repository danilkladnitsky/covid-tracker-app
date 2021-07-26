import React from "react";
import "../styles/Table.css";
function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({ country, cases }) => {
            return (
              <tr>
                <td>{country}</td>
                <td>
                  <strong>{cases}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
