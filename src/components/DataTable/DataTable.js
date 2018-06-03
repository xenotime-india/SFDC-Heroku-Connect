import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./dataTable.css";

export const DataTable = props => {
  return <ReactTable data={props.data} columns={props.columns} {...props} className="slds-table slds-table_bordered slds-table_cell-buffer -striped -highlight"/>;
};
DataTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array
};
