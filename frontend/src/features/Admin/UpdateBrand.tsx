import { useParams } from "react-router-dom";

const UpdateBrand = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default UpdateBrand;
