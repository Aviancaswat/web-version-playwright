import './ShinyText.css';

type SninyTextProps = {
  text: string,
  disabled?: boolean,
  speed?: number,
  className?: string
}

const ShinyTextAnimation: React.FC<SninyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;
  return (
    <div className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`} style={{ animationDuration }}>
      {text}
    </div>
  );
};

export default ShinyTextAnimation;