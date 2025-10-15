import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type CircleProgressProps = {
    value: number,
    text?: string | number,
    strokeColor?: string,
    textColor?: string,
    textFontSize?: number
}

const CircleProgress: React.FC<CircleProgressProps> = ({ value, text, strokeColor, textColor, textFontSize }) => {
    return (
        <CircularProgressbar
            value={value}
            text={`${text}%`}
            styles={{
                path: {
                    stroke: strokeColor
                },
                text: {
                    fill: textColor,
                    fontSize: textFontSize,
                    fontWeight: "bold"
                }
            }}
        />
    )
}

export default CircleProgress;