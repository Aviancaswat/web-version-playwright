import './ShinyText.css';

type SninyTextProps = {
  text: string,
  disabled?: boolean,
  speed?: number,
  className?: string,
  color?: string
}

const ShinyTextAnimation: React.FC<SninyTextProps> = ({ text, disabled = false, speed = 5, className = '', color }) => {
  const animationDuration = `${speed}s`;
  return (
    <div className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`} style={{ animationDuration, color: color || "hsla(0, 11%, 77%, 0.42)" }}>
      {text}
    </div>
  );
};

export default ShinyTextAnimation;