import ProductImage from "../atoms/product/ProductImage";
import ProductTitle from "../atoms/product/ProductTitle";
import ProductRate from "../atoms/product/ProductRate";
import ProductPrice from "../atoms/product/ProductPrice";
import { imageMap } from "../../assets/imageMap";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const resolvedImage = imageMap[product.image] ?? product.image;

    return (
        <Link to={`/product/${product.id}`} className="block border rounded-lg p-4 shadow-md w-[180px] m-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <ProductImage src={resolvedImage} alt={product.title}  />
            <ProductTitle title={product.title} />
            <ProductPrice price={product.price} />
            <ProductRate rate={product.rate} />
        </Link>
    );
}
export default ProductCard;

