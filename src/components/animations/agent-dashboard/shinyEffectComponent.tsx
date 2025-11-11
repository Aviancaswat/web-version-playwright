import './shinyEffect.css';

const ShinyTextAgent = ({ text = "", disabled = false, speed = 2, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`} style={{ animationDuration, backgroundColor: "gray", fontWeight: "bolder", padding: "5px 10px", borderRadius: "5px" }}>
      <p style={{fontWeight: "bolder"}}>{text}</p>
    </div>
  );
};

export default ShinyTextAgent;
