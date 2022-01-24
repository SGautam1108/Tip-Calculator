const inputs = document.querySelectorAll(".calc input");
const inputsNumeric = document.querySelectorAll(".calc__input-numeric");
const inputBill = document.querySelector(".calc__input-bill");
const inputTip = document.querySelector(".calc__input-tip");
const inputCount = document.querySelector(".calc__input-count");

const tipButtons = document.querySelectorAll(".calc__tip-button");
const resetButton = document.querySelector(".calc__reset");

const outputResults = document.querySelectorAll(".calc__output-result");
const outputTipAmt = document.querySelector(".calc__tip-amt");
const outputTotal = document.querySelector(".calc__total");

let billFlag = false,
    tipFlag = false,
    countFlag = false;

// Return to default values of each, Reset button

const resetAll = () => {
    resetInputs();

    disableTipButtons();

    disableReset();
};

const resetInputs = () => {
    inputs.forEach((input) => {
        if (input.value !== "" || input.classList.contains("input--entered")) {
            input.classList.remove("input--entered");

            //if input is custom tip, need to change type and set "Custom"
            if (input.classList.contains("calc__input-tip")) {
                input.setAttribute("type", "text");
                input.value = "Custom";
            } else {
                input.value = "0";
            }
        }
    });

    billFlag = false;
    tipFlag = false;
    countFlag = false;
};

const findActiveButton = () => {
    for (let btn of tipButtons) {
        if (btn.classList.contains("tip-button--active")) {
            return btn;
        }
    }
    return null;
};

const disableTipButtons = () => {
    let activeBtn = findActiveButton();
    if (activeBtn) activeBtn.classList.remove("tip-button--active");
    return activeBtn;
};

const disableReset = () => {
    resetButton.classList.add("reset--disabled");
    resetButton.setAttribute("aria-disabled", "true");
};

const enableReset = () => {
    resetButton.classList.remove("reset--disabled");
    resetButton.setAttribute("aria-disabled", "false");
};

const checkResetEnable = () => {
    if (resetButton.classList.contains("reset--disabled")) {
        enableReset();
    }
};

const checkValidInput = (currInp) => {
    const min = +currInp.getAttribute("min");
    const max = +currInp.getAttribute("max");

    if (currInp.value < min) {
        currInp.value = min;
    } else if (currInp.value > max) {
        currInp.value = max;
    } else return true;

    return false;
};

const checkTip = (btn) => {
    if (btn.classList.contains("calc__input-tip")) return true;
    else return false;
};

const checkBill = (btn) => {
    if (btn.classList.contains("calc__input-bill")) return true;
    else return false;
};

// Change text color of inputs when focused and type of tip custom

const inputsFocus = (e) => {
    let currInp = e.target;
    if (currInp.classList.contains("input--entered") == false) {
        currInp.classList.add("input--entered");
    }

    const isTipInp = checkTip(currInp);
    if (isTipInp) {
        currInp.setAttribute("type", "number");
    }

    checkResetEnable();
};

const inputsBlur = (e) => {
    let currInp = e.target;

    const isTipInp = checkTip(currInp);
    const isBillInp = checkBill(currInp);

    if (
        currInp.value == "" ||
        (isTipInp && currInp.value == "Custom") ||
        (!isTipInp && currInp.value == "0")
    ) {
        if (isTipInp) {
            currInp.setAttribute("type", "text");
            currInp.value = "Custom";
        } else currInp.value = "0";

        currInp.classList.remove("input--entered");

        //flag false => defaultValues inside input fields or might be that a button is selected
        if (isTipInp){
            const activeBtn = findActiveButton();
            if(!activeBtn) tipFlag = false; 
        }
        else if (isBillInp) billFlag = false;
        else countFlag = false;
    } else {
        let validInp = checkValidInput(currInp);

        if (!validInp) {
            //show error message while updating the data
        }

        //flag true => valid values exist
        if (isTipInp) {
            tipFlag = true;
            disableTipButtons();
        } else if (isBillInp) billFlag = true;
        else countFlag = true;
    }

    if (billFlag == false && tipFlag == false && countFlag == false) disableReset();
};

// Buttons active and deactivate others
/*
 * Can push the button again to toggle
 * Each button click must reset custom input
 * must reset others
 */

const selectTipButton = (e) => {
    const activeBtn = disableTipButtons();

    if (activeBtn === e.target) {
        tipFlag = false;
        return; // if the button clicked is the same as active
    } else {
        e.target.classList.add("tip-button--active");

        //valid tipFlag selected
        tipFlag = true;

        // input Tip to default
        inputTip.setAttribute("type", "text");
        inputTip.value = "Custom";
        if (inputTip.classList.contains("input--entered"))
            inputTip.classList.remove("input--entered");

        // enable Reset if disabled
        checkResetEnable();
    }
};

// Get inputs and tips(check button or custom)

const getInputs = () => {
    if (billFlag && tipFlag && countFlag) {
        let billValue = +inputBill.value;
        let tipValue = +inputTip.value;
        let countValue = +inputCount.value;

        const activeBtn = findActiveButton();
        if (activeBtn) tipValue = +activeBtn.textContent.replace("%", "");

        calculateOutput(billValue, tipValue, countValue);
    }
};

// Show Output

const calculateOutput = (b, t, c) => {
    const tipAmt = +((b * (0.01*t)) / c).toFixed(2);
    const total = +((b / c) + tipAmt).toFixed(2);

    console.log(outputTipAmt.textContent);
}

// Main code-

resetAll();
resetButton.addEventListener("click", resetAll);

inputs.forEach((input) => {
    input.addEventListener("focus", inputsFocus);
    input.addEventListener("blur", inputsBlur);
});

tipButtons.forEach((btn) => {
    btn.addEventListener("click", selectTipButton);
});

setInterval(() => {
    getInputs();
}, 1000);
