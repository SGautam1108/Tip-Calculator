const inputs = document.querySelectorAll(".calc input");
const inputsNumeric = document.querySelectorAll(".calc__input-numeric");
const inputBill = document.querySelector(".calc__input-bill");
const inputTip = document.querySelector(".calc__input-tip");
const inputCount = document.querySelector(".calc__input-count");

const tipButtons = document.querySelectorAll(".calc__tip-button");
const resetButton = document.querySelector(".calc__reset");

const outputResults = document.querySelectorAll(".calc__output-result");
const outputTipAmt = document.querySelector(".calc__tip-amt-result");
const outputTotal = document.querySelector(".calc__total-result");

const errorMsg = document.querySelector(".calc__invalid-message");


let billFlag = false,
    tipFlag = false,
    countFlag = false;

// Return to default values of each, Reset button

const resetAll = () => {
    resetInputs();

    disableTipButtons();

    disableReset();

    resetOutput();

    resetMessage();
};

const resetInputs = () => {
    inputs.forEach((input) => {
       
        input.classList.remove("input--entered");

        //if input is custom tip, need to change type and set "Custom"
        if (input.classList.contains("calc__input-tip")) {
            input.setAttribute("type", "text");
            input.value = "Custom";
        } else {
            input.value = "0";
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

const resetMessage = () => {
    errorMsg.classList.add("hidden");
    inputCount.classList.remove("calc__input-count--invalid");
}

const showMessage = () => {
    errorMsg.classList.remove("hidden");
    inputCount.classList.add("calc__input-count--invalid");
}

const resetOutput = () => {
    outputTipAmt.textContent = "$0.00";
    outputTotal.textContent = "$0.00";
}

const checkValidRange = (currInp) => {
    const min = +currInp.getAttribute("min");
    const max = +currInp.getAttribute("max");

    if (currInp.value < min) {
        currInp.value = min;
    } else if (currInp.value > max) {
        currInp.value = max;
    } else return true;

    return false;
};

const checkZeroCount = () => {

    if(inputCount.value == "0"){
        countFlag = false;

        if(billFlag && tipFlag){ // show message only if bill and tip entered
            showMessage();
        } else resetMessage();

    } else {
        countFlag = true;
        resetMessage();
    }
}


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
    currInp.value = "";
    
    currInp.classList.add("input--entered");
    

    const isTipInp = checkTip(currInp);
    if (isTipInp) {
        currInp.setAttribute("type", "number");
    }

    enableReset();
};

const inputsBlur = (e) => {
    let currInp = e.target;

    const isTipInp = checkTip(currInp);
    const isBillInp = checkBill(currInp);


    if (
        currInp.value == "" ||
        (isTipInp && currInp.value == "Custom") ||
        (isBillInp && currInp.value == "0")
    ) {

        //flag false => Blank/defaultValues inside input fields or might be that a button is selected

        if (isTipInp) {
            currInp.setAttribute("type", "text");
            currInp.value = "Custom";
            const activeBtn = findActiveButton();
            if(!activeBtn) tipFlag = false;
        } else if(isBillInp) {
            currInp.value = "0";
            billFlag = false;
        } else {
            currInp.value = "0";
            countFlag = false;
            if(billFlag && tipFlag){ // show message only if bill and tip entered
                showMessage();
            } else resetMessage();
        }

        currInp.classList.remove("input--entered");

    } else {

        checkValidRange(currInp);
       
        //flag true => valid values exist
        if (isTipInp) {
            tipFlag = true;
            disableTipButtons();
        }
        else if (isBillInp) billFlag = true;
        

        checkZeroCount();
        
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
        inputTip.classList.remove("input--entered");

        //check if number of people are correct
        checkZeroCount();

        // enable Reset if disabled
        enableReset();
    }
};

// Get inputs and tips(check button or custom)

const getInputs = () => {
    if (billFlag && tipFlag && countFlag) {
        let billValue = +inputBill.value;
        let tipValue = +inputTip.value;
        let countValue = +inputCount.value;

        console.log(countValue);

        const activeBtn = findActiveButton();
        if (activeBtn) tipValue = +activeBtn.textContent.replace("%", "");

        calculateOutput(billValue, tipValue, countValue);
    } else {
        if(outputTipAmt.textContent != "$0.00" || outputTotal.textContent != "$0.00") resetOutput();
    }
};

// Show Output

const calculateOutput = (bill, tip, count) => {

    if(!count || count == 0){
        resetOutput();
        return;
    }

    const tipAmt = ((bill * (0.01*tip)) / count).toFixed(2);
    const total = ((bill / count) + +tipAmt).toFixed(2);
    outputTipAmt.textContent = "$" + tipAmt;
    outputTotal.textContent = "$" + total;
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
    // console.log(billFlag, tipFlag, countFlag);
    getInputs();
}, 500);
