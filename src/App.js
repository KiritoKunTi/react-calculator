import { useState } from "react";
import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const btnValues = [
    ["C", "+-", "%", "/"],
    [7, 8, 9, "X"],
    [6, 5, 4, "-"],
    [3, 2, 1, "+"],
    [0, ".", "="]
]

const App = () => {
    const [ calc, setCalc ] = useState({
        sign: "",
        num: 0,
        res: 0,
    });

    const numClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        if ( String(calc.num).length < 16 ) {
            setCalc({
                ...calc, 
                num: 
                    calc.num === 0 && value === "0"
                    ? "0"
                    : calc.num % 1 === 0
                    ? Number(calc.num + value)
                    : calc.num + value,
                res: !calc.sign ? 0 : calc.res,
            });
        }
    }

    const commaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
        });
    }

    const signClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            sign: value,
            res: !calc.res && calc.num ? calc.num : calc.res,
            num: 0,
        });
    }

    const equalsClickHandler = (e) => {
        if ( calc.sign && calc.num ) {
            const math = (a, b, sign) => 
                sign === "+" 
                ? a + b 
                : sign === "-"
                ? a - b
                : sign === "X"
                ? a * b 
                : a / b;
            
            setCalc({
                ...calc,
                res: 
                    calc.num === "0" && calc.sign === "/"
                    ? "Can't divide by 0"
                    : math(Number(calc.res), Number(calc.num), calc.sign),
                sign: "",
                num: 0,
            });
        }
    }
    
    const invertClickHandler = () => {
        setCalc({
            ...calc, 
            num: calc.num ? calc.num * -1 : 0, 
            res: calc.res ? calc.res * -1 : 0,
            sign: "",
        })
    }

    const percentClickHandler = () => {
        let num = calc.num ? parseFloat(calc.num) : 0;
        let res = calc.res ? parseFloat(calc.res) : 0;

        setCalc({
            ...calc,
            res: (res /= Math.pow(100 ,1)),
            num: (num /= Math.pow(100, 1)),
        })
    }

    const resetClickHandler = () => {
        setCalc({
            ...calc, 
            num: 0,
            res: 0, 
            sign: "0",
        })
    }

    return(
        <Wrapper>
            <Screen value={calc.num ? calc.num : calc.res}/>
            <ButtonBox>
                {
                    btnValues.flat().map((btn, i) => {
                        return(
                            <Button 
                                key={i}
                                className={btn === "=" ? "equals" : ""}
                                value={btn}
                                onClick={
                                    btn === "C"
                                    ? resetClickHandler
                                    : btn === "+-"
                                    ? invertClickHandler 
                                    : btn === "%"
                                    ? percentClickHandler
                                    : btn === "="
                                    ? equalsClickHandler
                                    : btn === "/" || btn === "X" || btn === "+" || btn === "-"
                                    ? signClickHandler
                                    : btn === "."
                                    ? commaClickHandler
                                    : numClickHandler
                                }
                                >
                                
                            </Button>
                        )
                    })
                }
            </ButtonBox>
        </Wrapper>
    );
}   

export default App;