import { useEffect, useState } from "react";
// import ProductForm from "../components/ProductForm";
// import ProductList from "../components/ProductList";
import axios from "axios";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/products")
  //     .then((res) => {
  //       setProducts(res.data);
  //       setLoaded(true);
  //     })
  //     .catch((err) => console.error(err));
  // }, [loaded]);

  return (
    <>
      {/* <ProductForm setLoaded={setLoaded} />
      {loaded && <ProductList setLoaded={setLoaded} products={products} />} */}
    </>
  );
};
export default Main;
