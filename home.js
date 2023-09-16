const quizQuestions = [
    {
        question: "Which language runs in a web browser?",
        opt1: "Java",
        opt2: "C",
        opt3: "Python",
        opt4: "JavaScript",
        correct: "opt4",
    },
    {
        question: "What does CSS stand for?",
        opt1: "Central Style Sheets",
        opt2: "Cascading Style Sheets",
        opt3: "Cascading Simple Sheets",
        opt4: "Cars SUVs Sailboats",
        correct: "opt2",
    },
    {
        question: "What does HTML stand for?",
        opt1: "Hypertext Markup Language",
        opt2: "Hypertext Markdown Language",
        opt3: "Hyperloop Machine Language",
        opt4: "Helicopters Terminals Motorboats Lamborginis",
        correct: "opt1",
    },
    {
        question: "What year was JavaScript launched?",
        opt1: "1996",
        opt2: "1995",
        opt3: "1994",
        opt4: "none of the above",
        correct: "opt2",
    },
];

let question_number_element = document.getElementById("question-number");
let question_txt_element = document.getElementById("question-txt");
let option_1_element = document.getElementById("option1");
let option_2_element = document.getElementById("option2");
let option_3_element = document.getElementById("option3");
let option_4_element = document.getElementById("option4");
let next_button = document.getElementById("next-button");
let back_button = document.getElementById("back-button");
let time_element = document.getElementById("timer");

let current_question_number = 0;
let score = 0;
let time;
const total_time = 30;
let sec = total_time;
const selectedOptions = new Array(quizQuestions.length).fill(null);
const remainingTimes = new Array(quizQuestions.length).fill(total_time);
const times_copy = [];
let lastAnsweredQ923184305141null;
let cont_interval = null;

function timer() {
    let minutes = Math.floor(sec / 60);
    let seconds = sec % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    time_element.innerHTML = formattedMinutes + ':' + formattedSeconds;
    if (selectedOptions[current_question_number] === null) {
        if (sec <= 0) {
            clearInterval(time);
            remainingTimes[current_question_number] = 0;
            selectedOptions[current_question_number] = 'opt5';
            current_question_number++;
            showQuestion();
            sec = total_time;
        } else {
            sec--;
            remainingTimes[current_question_number] = sec;
        }
    } else {
        clearInterval(time);
    }
}

let is_prev_pressed = 0;

function showQuestion(type = "next") {
    // Clear the current timer
    clearInterval(time);
    if (remainingTimes[current_question_number] === 'NA') {
        time_element.innerHTML = 'NA';
    } else {
        if (cont_timer && type === "next") {
            sec = cont_timer;
            clearInterval(cont_interval);
            cont_timer = null;
        }
        else
            sec = is_prev_pressed > 0 ? curr_timer : remainingTimes[current_question_number];

        time = setInterval(timer, 1000);
        if (!times_copy[current_question_number]) {
            timer();
        } else {
            let item = times_copy[current_question_number]
            let minutes = Math.floor(item / 60);
            let seconds = times_copy[current_question_number] % 60;

            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            time_element.innerHTML = formattedMinutes + ':' + formattedSeconds;
        }
    }

    if (selectedOptions[current_question_number] === null) {
        document.923184305141er_element.innerHTML = (current_question_number + 1) + ". ";
    question_txt_element.innerHTML = quizQuestions[current_question_number].question;
    option_1_element.innerHTML = quizQuestions[current_question_number].opt1;
    option_2_element.innerHTML = quizQuestions[current_question_number].opt2;
    option_3_element.innerHTML = quizQuestions[current_question_number].opt3;
    option_4_element.innerHTML = quizQuestions[current_question_number].opt4;

    const selectedOptionId = selectedOptions[current_question_number];
    if (selectedOptionId) {
        document.getElementById(selectedOptionId).checked = true;
        document.querySelectorAll('input[name=opt]').forEach(option => {
            option.disabled = true;
        });
        next_button.disabled = false;
    } else {
        document.querySelectorAll('input[name=opt]').forEach(option => {
            option.disabled = false;
        });
    }
}


document.querySelectorAll('input[name=opt]').forEach(option => {
    option.addEventListener('click', () => {
        const questionIndex = current_question_number;
        const optionIdSelected = option.id;

        selectedOptions[questionIndex] = optionIdSelected;
        remainingTimes[questionIndex] = sec + 1;
        times_copy.push(sec + 1);
        curr_timer = sec + 1;

        document.querySelectorAll('input[name=opt]').forEach(otherOption => {
            if (otherOption !== option) otherOption.disabled = true;
        });

        clearInterval(time);

        next_button.disabled = false;

        if (optionIdSelected === quizQuestions[questionIndex].correct) {
            score++;
        }

    });
});


next_button.addEventListener('click', () => {
    is_prev_pressed >= 0 ? is_prev_pressed-- : is_prev_pressed = 0;
    lastAnsweredQuestion = current_question_number;
    current_question_number++;
    if (current_question_number >= quizQuestions.length) {
        goToResultPage();
    } else {
        showQuestion();
        if (selectedOptions[current_question_number] !== null) {
            next_button.disabled = false;
            clearInterval(time);
        } else {
            next_button.disabled = true;
        }
    }
});

back_button.addEventListener('click', () => {
    if (current_question_number > 0) {
        is_prev_pressed++;
        cont_timer = sec;

        if (!times_copy[current_question_number]) {
            cont_interval = setInterval(() => {
                if (cont_timer <= 0) {
                    clearInterval(cont_timer);
                    remainingTimes[current_question_number] = 0;
                    selectedOptions[current_question_number] = 'opt5';
                    current_question_number++;
                } else {
                    cont_timer--;
                    remainingTimes[current_question_number] = cont_timer;
                }
            }, 1000)
        }

        const optionIdSelected = document.querySelector('input[name=opt]:checked');
        if (optionIdSelected != null) {
            selectedOptions[current_question_number] = optionIdSelected.id;
            lastAnsweredQuestion = current_question_number;
        } else if (current_question_number === lastAnsweredQuestion) {

            selectedOptions[current_question_number] = null;
        }

        current_question_number--;
        if (current_question_number < 0) {
            current_question_number = 0;
        }

        showQuestion("back");

        document.querySelectorAll('input[name=opt]').forEach(option => {
            option.disabled = true;
        });
        clearInterval(time);
    }
});


function goToResultPage() {
    current_question_number = 0;
    localStorage.setItem("score", score);
    // window.location.href = "/resultPage.html";
}

showQuestion();
