
import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import './App.css';

function App() {
    const [value, setValue] = useState('');
    const [health, setHealth] = useState(200);
    const [monster, setMonster] = useState({})
    const [level, setLevel] = useState(1);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        fetch('/monsters.json')
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data:', data);
                setLevel(data.level);
                setMonster(data.monster);
                setHealth(data.monster.health); // Set initial monster health
            })
            .catch((error) => console.error('Error fetching monster data:', error));
    }, []);


    const handleClick = (e) => {
        setValue(value + e.target.value);
    };

    const handleEvaluate = () => {
        try {
            let expression = value;/*.replace(/sqrt/g, 'Math.sqrt')
                                  .replace(/sin/g, 'Math.sin')
                                  .replace(/cos/g, 'Math.cos')
                                  .replace(/exp/g, '**')
                                  .replace(/π/g, 'Math.PI');*/

            let leftBrackets = 0;
            let rightBrackets = 0;

            for (const char of expression) 
            {
                if(char == '(') leftBrackets++;
                else if(char == ')') rightBrackets++;
            }

            if(leftBrackets > rightBrackets)
            {
                for(let i = 0; i < leftBrackets-rightBrackets; i++)
                    expression = expression + ")";
            }

            setValue(evaluate(expression));

            setHealth(prevHealth => Math.max((prevHealth - Math.abs(evaluate(expression)).toFixed(3)), 0));
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
            <div className="level-banner">Level {level} - {monster.name}</div>
                <div className={`image-container ${isBlinking ? 'blink' : ''}`}>
                    <img src={monster.image} alt="Placeholder" className='monster idle-animation' />
                    <div className="health-bar">
                        <div className="health" style={{ width: `${health/monster.health*200}px` }}></div>
                    </div>
                    <div className="health-counter">{health} / {monster.health}</div>
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
