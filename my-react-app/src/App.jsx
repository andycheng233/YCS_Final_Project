import React, { useState } from 'react';
import './App.css';

function App() {
    const [value, setValue] = useState('');
    const [health, setHealth] = useState(200);
    const [isBlinking, setIsBlinking] = useState(false);

    const handleClick = (e) => {
        setValue(value + e.target.value);
    };

    const handleEvaluate = () => {
        try {
            let expression = value.replace(/sqrt/g, 'Math.sqrt')
                                  .replace(/sin/g, 'Math.sin')
                                  .replace(/cos/g, 'Math.cos')
                                  .replace(/exp/g, '**')
                                  .replace(/π/g, 'Math.PI');
            // eslint-disable-next-line no-eval
            setValue(String(eval(expression)));
            setHealth(prevHealth => Math.max(prevHealth - 10, 0)); // Reduce health by 10, but not below 0
            triggerBlink();
        } catch (e) {
            setValue('Error');
        }
    };

    const triggerBlink = () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200); // Blink red for 200ms
    };

    return (
        <div className="container">
            <div className="left">
                <div className={`image-container ${isBlinking ? 'blink' : ''}`}>
                    <img src="monster.png" alt="Placeholder" className='monster' />
                    <div className="health-bar">
                        <div className="health" style={{ width: `${health}px` }}></div>
                    </div>
                    <div className="health-counter">{health} / 200</div>
                </div>
            </div>
            <div className="right">
                <div className="calculator">
                    <form action="">
                        <div className="display">
                            <input type="text" value={value} readOnly />
                        </div>
                        <div>
                            <input type="button" value="AC" onClick={() => setValue('')} />
                            <input type="button" value="DE" onClick={() => setValue(value.slice(0, -1))} />
                            <input type="button" value="(" onClick={handleClick} />
                            <input type="button" value=")" onClick={handleClick} />
                            <input type="button" value="." onClick={handleClick} />
                            <input type="button" value="/" onClick={handleClick} />
                        </div>
                        <div>
                            <input type="button" value="7" onClick={handleClick} />
                            <input type="button" value="8" onClick={handleClick} />
                            <input type="button" value="9" onClick={handleClick} />
                            <input type="button" value="*" onClick={handleClick} />
                        </div>
                        <div>
                            <input type="button" value="4" onClick={handleClick} />
                            <input type="button" value="5" onClick={handleClick} />
                            <input type="button" value="6" onClick={handleClick} />
                            <input type="button" value="+" onClick={handleClick} />
                        </div>
                        <div>
                            <input type="button" value="1" onClick={handleClick} />
                            <input type="button" value="2" onClick={handleClick} />
                            <input type="button" value="3" onClick={handleClick} />
                            <input type="button" value="-" onClick={handleClick} />
                        </div>
                        <div>
                            <input type="button" value="sqrt" onClick={() => handleClick({ target: { value: 'sqrt(' } })} />
                            <input type="button" value="sin" onClick={() => handleClick({ target: { value: 'sin(' } })} />
                            <input type="button" value="cos" onClick={() => handleClick({ target: { value: 'cos(' } })} />
                            <input type="button" value="exp" onClick={() => handleClick({ target: { value: '**' } })} />
                        </div>
                        <div>
                            <input type="button" value="π" onClick={() => handleClick({ target: { value: 'π' } })} />
                            <input type="button" value="0" onClick={handleClick} />
                            <input type="button" value="=" className="equal" onClick={handleEvaluate} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
