import * as React from "react";

import "./Counter.css";

interface CounterProps {}

function useInterval(callback: any, delay: number) {
  const savedCallback = React.useRef<any>();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const Counter = ({}: CounterProps) => {
  const [symbols, setSymbols] = React.useState("0123456789");
  const [decimalValText, setDecimalValText] = React.useState("0");
  const [decimalVal, setDecimalVal] = React.useState(
    Number.parseInt(decimalValText, 10)
  );
  const [prevVal, setPrevVal] = React.useState(decimalVal);
  const [numDigitsText, setNumDigitsText] = React.useState("10");
  const [numDigits, setNumDigits] = React.useState(
    Number.parseInt(numDigitsText, 10)
  );

  const [isCounting, setIsCounting] = React.useState(false);

  const maxDigits = 24;
  const minDigits = 1;

  const base = symbols.length;

  const onPresetClick =
    (symbolsToSet: string) => (evt: React.MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      setSymbols(symbolsToSet);
    };

  const onSymbolsChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const txtVal = evt.currentTarget.value.trim();
    setSymbols(txtVal);
  };

  const onDecimalValChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const txtVal = evt.currentTarget.value.trim();
    const numVal = Number.parseInt(txtVal, 10);
    setDecimalValText(txtVal);

    if (numVal >= 0) {
      setPrevVal(decimalVal);
      setDecimalVal(numVal);
    }
  };

  const onIncrement = () => {
    let newVal = decimalVal + 1;
    if (newVal.toString().length > maxDigits) {
      newVal = 0;
    }
    setDecimalVal(newVal);
    setPrevVal(decimalVal);
    setDecimalValText(newVal.toString());
  };

  const onDecrement = () => {
    const newVal = decimalVal - 1;
    if (newVal >= 0) {
      setDecimalVal(newVal);
      setPrevVal(decimalVal);
      setDecimalValText(newVal.toString());
    }
  };

  useInterval(() => {
    if (isCounting) {
      onIncrement();
    }
  }, 1000);

  const onNumDigitsChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const txtVal = evt.currentTarget.value.trim();
    const numVal = Number.parseInt(evt.currentTarget.value, 10);
    setNumDigitsText(txtVal);
    setNumDigits(Math.max(minDigits, Math.min(maxDigits, numVal)));
  };

  const onToggleAuto = () => {
    setIsCounting(!isCounting);
  };

  let progressiveVal = decimalVal;
  const digits = Array(numDigits)
    .fill(0)
    .map((_, i) => {
      const digit = progressiveVal % base;
      progressiveVal = progressiveVal / base;

      return Math.floor(digit);
    })
    .reverse();

  return (
    <div className="counter">
      <div className="presets">
        <a href="#" onClick={onPresetClick("0123456789")}>
          Decimal
        </a>
        <a href="#" onClick={onPresetClick("01")}>
          Binary
        </a>
        <a href="#" onClick={onPresetClick("012356789ABCDEF")}>
          Hexadecimal
        </a>
      </div>
      <div className="inputs">
        <label>Symbols (in order) for each digit:</label>
        <input
          type="text"
          className="symbolInput"
          value={symbols}
          onChange={onSymbolsChange}
        />
        <label>Number of digits:</label>
        <input
          type="number"
          min={minDigits}
          max={maxDigits}
          className="digitNumberInput"
          value={numDigitsText}
          onChange={onNumDigitsChange}
        />
        <label>Value of counter (in decimal):</label>
        <input
          type="text"
          className="decimalVal"
          value={decimalValText}
          onChange={onDecimalValChange}
        />
      </div>
      <div className="counterDevice">
        <button type="button" className="button goButton" onClick={onToggleAuto}>{isCounting ? "Stop" : "Start"}</button>
        <div className="counterDigits">
          {digits.map((digit, i) => (
            <div key={i} className="counterDigit">
              <div className="digitWindow">
                <div
                  className="digitWheel"
                  style={{
                    transform: `translateY(${-40 * digit}px)`,
                  }}
                >
                  {symbols.split("").map((symbol, i) => (
                    <div
                      key={i}
                      className="digitCell"
                      style={{
                        backgroundColor: `rgba(${
                          255 * (i / (base - 1))
                        }, 166, 0, 0.5)`,
                      }}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="button incdecbutton" onClick={onDecrement}>-</button>
        <button type="button" className="button incdecbutton" onClick={onIncrement}>+</button>
      </div>
    </div>
  );
};
