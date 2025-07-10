import React from "react";
import { useParams } from "react-router-dom";

const DacTinhDetail = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default DacTinhDetail;
