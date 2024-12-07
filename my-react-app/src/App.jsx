import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import './App.css';
import levelData from './levelData.json';

function getRandomNumber(max = 10) {
    return Math.floor(Math.random() * max);
}

function getRandomMathQuestion(monstersKilled) {
    const num1 = getRandomNumber();
    const num2 = getRandomNumber();
    let question, correct, answers;

    if (monstersKilled < 5) {
        // Ask only + and - questions for the first 5 monsters
        if (Math.random() > 0.5) {
            question = `What is the sum of ${num1} + ${num2}?`;
            correct = (num1 + num2).toString();
            answers = [
                correct,
                (num1 + getRandomNumber()).toString(),
                (num2 + getRandomNumber()).toString(),
                (num1 + num2 + getRandomNumber()).toString()
            ];
        } else {
            question = `What is ${num1} - ${num2}?`;
            correct = (num1 - num2).toString();
            answers = [
                correct,
                (num1 - getRandomNumber()).toString(),
                (num2 - getRandomNumber()).toString(),
                (num1 - num2 - getRandomNumber()).toString()
            ];
        }
    } else {
        // Ask / and * questions after the first 5 monsters
        if (Math.random() > 0.5) {
            question = `What is ${num1} * ${num2}?`;
            correct = (num1 * num2).toString();
            answers = [
                correct,
                (num1 * getRandomNumber()).toString(),
                (num2 * getRandomNumber()).toString(),
                (num1 * num2 * getRandomNumber()).toString()
            ];
        } else {
            question = `What is ${num1} / ${num2}?`;
            correct = (num2 !== 0 ? (num1 / num2).toFixed(2) : 'undefined');
            answers = [
                correct,
                (num1 / getRandomNumber()).toFixed(2),
                (getRandomNumber() / num2).toFixed(2),
                (getRandomNumber() / getRandomNumber()).toFixed(2)
            ];
        }
    }

    return { question, answers: answers.sort(() => Math.random() - 0.5), correct };
}

function getRandomMonster() {
    const levelInfo = levelData.levels[1]; // Assuming single-level data
    return levelInfo.monsters[Math.floor(Math.random() * levelInfo.monsterNum)];
}

function App() {
    const [value, setValue] = useState('');
    const [health, setHealth] = useState(0);
    const [maxHealth, setMaxHealth] = useState(0);
    const [monster, setMonster] = useState('');
    const [monsterImage, setMonsterImage] = useState('');
    const [monstersKilled, setMonstersKilled] = useState(0);
    const [isBlinking, setIsBlinking] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const [isRespawning, setIsRespawning] = useState(false);
    const [recommendation, setRecommendation] = useState('');
    const [flashcard, setFlashcard] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFlashcard, setShowFlashcard] = useState(false); // Initially false
    const [blinkClass, setBlinkClass] = useState('');

    const Flashcard = ({ question, answers, onAnswer }) => (
        <div className={`flashcard ${blinkClass}`}>
            <h3 className="flashcard-header">Quiz Time!</h3>
            <h3 className="flashcard-question">{question}</h3>
            <div className="flashcard-answers">
                {answers.map((answer, index) => (
                    <button
                        key={index}
                        className="flashcard-answer"
                        onClick={() => onAnswer(answer)}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        </div>
    );

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        if (answer === flashcard.correct) {
            setBlinkClass('correct-blink');
            setTimeout(() => {
                setFlashcard(null);
                setBlinkClass('');
                setShowFlashcard(false); // Hide flashcard after correct answer
            }, 500); // 500ms blink
        } else {
            setBlinkClass('incorrect-blink');
            setTimeout(() => setBlinkClass(''), 500); // 500ms blink
        }
    };

    useEffect(() => {
        const initialMonsterInfo = getRandomMonster();
        setHealth(initialMonsterInfo.health);
        setMaxHealth(initialMonsterInfo.health);
        setMonster(initialMonsterInfo.name);
        setMonsterImage(initialMonsterInfo.image);
        setRecommendation(levelData.levels[1].recommendation);
    }, []);

    const resetGame = () => {
        console.log("resetting");
        setMonstersKilled(0);
        const initialMonsterInfo = getRandomMonster();
        setHealth(initialMonsterInfo.health);
        setMaxHealth(initialMonsterInfo.health);
        setMonster(initialMonsterInfo.name);
        setMonsterImage(initialMonsterInfo.image);
        setRecommendation(levelData.levels[1].recommendation);
        setValue('');
        setShowFlashcard(true); // Show flashcard on reset
        setFlashcard(getRandomMathQuestion(monstersKilled));
    };

    const handleClick = (e) => {
        setValue(value + e.target.value);
    };

    const handleEvaluate = () => {
        try {
            if (value !== '') {
                let expression = String(value).replace(/π/g, 'PI');
                let leftBrackets = (expression.match(/\(/g) || []).length;
                let rightBrackets = (expression.match(/\)/g) || []).length;
                if (leftBrackets > rightBrackets) {
                    expression = expression + ")".repeat(leftBrackets - rightBrackets);
                }
                expression = evaluate(expression);
                setValue(expression);
                const newHealth = Math.max(health - Math.abs(expression), 0);
                setHealth(parseFloat(newHealth.toFixed(3)));
                if (newHealth === 0) {
                    setIsDead(true);
                    setMonstersKilled(prev => prev + 1);
                    setTimeout(() => {
                        setShowFlashcard(true); // Show flashcard when monster is defeated
                        respawnMonster();
                    }, 1000);
                    setIsRespawning(true);
                    setTimeout(() => setIsRespawning(false), 2250);
                }
                triggerBlink();
            }
        } catch (e) {
            setValue('Error');
        }
    };

    const respawnMonster = () => {
        const monsterInfo = getRandomMonster();
        setHealth(monsterInfo.health);
        setMaxHealth(monsterInfo.health);
        setMonster(monsterInfo.name);
        setMonsterImage(monsterInfo.image);
        setRecommendation(levelData.levels[1].recommendation);
        setIsDead(false);
        setFlashcard(getRandomMathQuestion(monstersKilled));
    };

    const triggerBlink = () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
    };

    return (
        <div className="container">
            <div className="left">
                {showFlashcard && flashcard && (
                    <Flashcard
                        question={flashcard.question}
                        answers={flashcard.answers}
                        onAnswer={handleAnswer}
                    />
                )}
                <div className="kill-counter">
                    Monsters Killed: {monstersKilled}
                </div>
                <div className={`image-container ${isBlinking ? 'blink' : ''}`}>
                    <img src={monsterImage} alt="Placeholder" className={`monster ${isDead ? 'die-animation' : isRespawning ? 'respawn-animation' : 'idle-animation'}`} />
                    <div className="health-bar">
                        <div className="health" style={{ width: `${health / maxHealth * 200}px` }}></div>
                    </div>
                    <div className="health-counter">{health} / {maxHealth}</div>
                    <div className="recommendation-box">{recommendation}</div>
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
                <button className="reset-button" onClick={resetGame}>Reset Game</button>
            </div>
        </div>
    );
}

export default App;
