function ProductImage({ src, alt }) {
  return (
    <img src={src} alt={alt} className="w-full h-[150px] object-cover" />
  );
}
export default ProductImage;