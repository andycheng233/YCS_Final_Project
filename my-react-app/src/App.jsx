
import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import './App.css';
import levelData from './levelData.json';

function getLevelData(currLevel){
    if(levelData.levels[currLevel])
        {
        return levelData.levels[currLevel];
        }
    else return NULL;
}

function App() {

    const [value, setValue] = useState('');
    const [health, setHealth] = useState(0);
    const [maxHealth, setMaxHealth] = useState(0);
    const [monster, setMonster] = useState('');
    const [monsterImage, setMonsterImage] = useState('');
    const [monstersKilled, setMonstersKilled] = useState(0);
    const [level, setLevel] = useState(1);
    const [levelName, setLevelName] = useState('');
    const [isBlinking, setIsBlinking] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const [isRespawning, setIsRespawning] = useState(false);
    
    useEffect(() => {
    localStorage.clear();
    if(!localStorage.getItem('level'))
    {
        console.log("setting level");
        localStorage.setItem('level', 1);
    }
    if(!localStorage.getItem('monstersKilled'))
    {
        console.log("setting monsters killed");
        localStorage.setItem('monstersKilled', 0);
    }
    const savedLevel = localStorage.getItem('level');
        const savedMonstersKilled = Number(localStorage.getItem('monstersKilled'));

        // Get the level data based on the saved level
        const levelInfo = getLevelData(savedLevel);
        const monsterInfo = levelInfo.monsters[Math.floor(Math.random() * levelInfo.monsterNum)];

        // Update state with values from localStorage and level data
        setLevel(savedLevel);
        setMonstersKilled(savedMonstersKilled);
        setHealth(monsterInfo.health);
        setMaxHealth(monsterInfo.health);
        setMonster(monsterInfo.name);
        setMonsterImage(monsterInfo.image);
        setLevelName(levelInfo.name);
}, []);

    //localStorage.clear();
    //console.log("hey");
    //console.log(monstersKilled);

    const resetGame = () => {
        // Reset level and monsters killed in local storage
        localStorage.setItem('level', 1);
        localStorage.setItem('monstersKilled', 0);
    
        // Reset state variables
        setLevel(1);
        setMonstersKilled(0);
    
        // Reset monster data
        const initialLevelInfo = getLevelData(1);
        const initialMonsterInfo = initialLevelInfo.monsters[Math.floor(Math.random() * initialLevelInfo.monsterNum)];
        
        setHealth(initialMonsterInfo.health);
        setMaxHealth(initialMonsterInfo.health);
        setMonster(initialMonsterInfo.name);
        setMonsterImage(initialMonsterInfo.image);
        setLevelName(initialLevelInfo.name);
    
        // Clear the calculator input
        setValue('');
    };

    const handleClick = (e) => {
        setValue(value + e.target.value);
    };

    useEffect(() => {
            localStorage.setItem('monstersKilled', monstersKilled);
    }, [monstersKilled]);

    

    const handleEvaluate = () => {
        try {
            let expression = String(value).replace(/π/g, 'PI');

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
                setMonstersKilled(prevMonstersKilled => {
                const newMonstersKilled = prevMonstersKilled + 1;
                 if(newMonstersKilled < 10 || level == 5)
                    {
                        const levelInfo = getLevelData(level);
                        const monsterInfo = levelInfo.monsters[Math.floor(Math.random() * levelInfo.monsterNum)];
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

                else
                {
                    const newLevel = Number(level) + 1;
                    setLevel(newLevel);
                    localStorage.setItem('level', newLevel);
                    
                    setMonstersKilled(0);
                    localStorage.setItem('monstersKilled', 0);
        
                    const newLevelInfo = getLevelData(newLevel);
                    const newMonsterInfo = newLevelInfo.monsters[Math.floor(Math.random() * newLevelInfo.monsterNum)];
                    setTimeout(() => {
                        setHealth(newMonsterInfo.health);
                        setMaxHealth(newMonsterInfo.health);
                        setMonster(newMonsterInfo.name);
                        setMonsterImage(newMonsterInfo.image);
                        setLevelName(newLevelInfo.name);
                        setIsDead(false);
                }, 1000);
    
                    setIsRespawning(true);
                    setTimeout(() => setIsRespawning(false), 2250);
                }

                    return newMonstersKilled;
                });
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
                            <input type="button" value="exp" onClick={() => handleClick({ target: { value: '^' } })} />
                        </div>
                        <div>
                            <input type="button" value="π" onClick={() => handleClick({ target: { value: 'π' } })} />
                            <input type="button" value="0" onClick={handleClick} />
                            <input type="button" value="=" className="equal" onClick={handleEvaluate} />
                        </div>
                    </form>
                </div>
                <button className="reset-button" onClick={resetGame}> Reset Game</button>
            </div>
        </div>
    );
}

export default App;
