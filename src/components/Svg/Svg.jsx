export default function Svg({ children, viewBox = "0 0 24 24", className }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}
