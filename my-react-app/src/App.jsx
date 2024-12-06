
import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import './App.css';
import userProgress from './userProgress.json';
import levelData from './levelData.json';

function getLevelData(currLevel){
    if(levelData.levels[currLevel])
        {
        return levelData.levels[currLevel];
        }
    else return NULL;
}

function App() {
    const levelInfo = getLevelData(userProgress.level);
    const monsterInfo = levelInfo.monsters[Math.floor(Math.random() * levelInfo.monsterNum)];

    const [value, setValue] = useState('');
    const [health, setHealth] = useState(monsterInfo.health);
    const [maxHealth, setMaxHealth] = useState(monsterInfo.health);
    const [monster, setMonster] = useState(monsterInfo.name)
    const [monsterImage, setMonsterImage] = useState(monsterInfo.image);
    const [monstersKilled, setMonstersKilled] = useState(() => {
        return localStorage.getItem('monstersKilled') ?  Number(localStorage.getItem('monstersKilled')) : 0;
    });
    console.log(localStorage);
    const [level, setLevel] = useState(userProgress.level);
    const [levelName, setLevelName] = useState(levelInfo.name);
    const [isBlinking, setIsBlinking] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const [isRespawning, setIsRespawning] = useState(false);

    //localStorage.clear();
    console.log("hey");
    console.log(monstersKilled);

    const handleClick = (e) => {
        setValue(value + e.target.value);
    };

    useEffect(() => {
        localStorage.setItem('monstersKilled', monstersKilled);
    }, [monstersKilled]); // This will run when monstersKilled changes

    const handleEvaluate = () => {
        try {
            let expression = value;
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
            expression = evaluate(expression);
            setValue(expression);

            const newHealth = Math.max((health - Math.abs(expression)), 0);
            setHealth(parseFloat(newHealth.toFixed(3)));
    
            if (newHealth === 0) {
                setIsDead(true);
                console.log("Monster defeated");
                // Update monstersKilled after health is set to 0
                setMonstersKilled(prevMonstersKilled => {
                    const newMonstersKilled = prevMonstersKilled + 1;
                    console.log(newMonstersKilled);
                    return newMonstersKilled;
                });

                setTimeout(() => {
                    setHealth(monsterInfo.health);  // Reset health to the new monster's health
                    setMaxHealth(monsterInfo.health);  // Set max health
                    setMonster(monsterInfo.name);  // Set new monster name
                    setMonsterImage(monsterInfo.image);  // Set new monster image
                    setIsDead(false);
                }, 1000);

                setIsRespawning(true);
                setTimeout(() => setIsRespawning(false), 2250);
            }

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
            <div className="level-banner">Level {level} - {levelName}</div>
            <div className="kill-counter">
                Monsters Killed: {monstersKilled}/10
            </div>
                <div className={`image-container ${isBlinking ? 'blink' : ''}`}>
                    <img src={monsterImage} alt="Placeholder"  className={`monster ${isDead ? 'die-animation' : isRespawning ? 'respawn-animation' : 'idle-animation'}`} />
                    <div className="health-bar">
                        <div className="health" style={{ width: `${health/maxHealth*200}px` }}></div>
                    </div>
                    <div className="health-counter">{health} / {maxHealth}</div>
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
