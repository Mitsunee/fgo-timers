export default function Svg({ children, viewBox = "0 0 24 24", ...props }) {
  return (
    <svg
      viewBox={viewBox}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      {children}
    </svg>
  );
}
