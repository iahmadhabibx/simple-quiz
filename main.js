const MAX_TIME = 15;
const correct = ["JavaScript", "Cascading Style Sheets", "Hypertext Markup Language", "1995"];
const quizQuestions = [
    {
        question: 'Which language runs in a web browser?',
        opt1: 'Java',
        opt2: 'C',
        opt3: 'Python',
        opt4: 'JavaScript',
        timer: null,
        consumed: MAX_TIME,
    },
    {
        question: 'What does CSS stand for?',
        opt1: 'Central Style Sheets',
        opt2: 'Cascading Style Sheets',
        opt3: 'Cascading Simple Sheets',
        opt4: 'Cars SUVs Sailboats',
        timer: null,
        consumed: MAX_TIME,
    },
    {
        question: 'What does HTML stand for?',
        opt1: 'Hypertext Markup Language',
        opt2: 'Hypertext Markdown Language',
        opt3: 'Hyperloop Machine Language',
        opt4: 'Helicopters Terminals Motorboats Lamborginis',
        timer: null,
        consumed: MAX_TIME,
    },
    {
        question: 'What year was JavaScript launched?',
        opt1: '1996',
        opt2: '1995',
        opt3: '1994',
        opt4: 'none of the above',
        timer: null,
        consumed: MAX_TIME,
    },
];
const selected = [];
let current_index = 0;
let bg_timer;
let bg_interval;
let score = 0;
let TIMER_NODE = document.getElementById('timer');

const loadQuestion = (index) => {
    document.getElementById('option1').innerText = quizQuestions[index].opt1;
    document.getElementById('option2').innerText = quizQuestions[index].opt2;
    document.getElementById('option3').innerText = quizQuestions[index].opt3;
    document.getElementById('option4').innerText = quizQuestions[index].opt4;
    document.getElementById('question-number').innerText = index + 1;
    document.getElementById('question-txt').innerText =
        quizQuestions[index].question;
};

const updateSelection = (option) => {
    let opt = document.getElementById(option)
    selected[current_index] = opt.innerText;
    const options = document.querySelectorAll('input[name=opt]');
    if (opt.innerText === correct[current_index]) score++;
    clearInterval(quizQuestions[current_index].timer);
    options.forEach(opt => {
        opt.disabled = true;
    });
    document.getElementById("next-button").disabled = false;
};

const loadTime = (consumed) => {
    let minutes = Math.floor(consumed / 60);
    let seconds = consumed % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    TIMER_NODE.innerText = formattedMinutes + ':' + formattedSeconds;
};

const startInterval = (index) => {
    clearInterval(quizQuestions[index].timer);
    if (quizQuestions[index].consumed === 0) {
        loadTime(0);
    }
    else {
        if (selected[index] === undefined || selected[index] === null) {
            if (bg_timer > -1) {
                quizQuestions[index].consumed = bg_timer;
                bg_timer = null;
                clearInterval(bg_interval);
                bg_interval = null;
            }
            quizQuestions[index].timer = setInterval(() => {
                if (quizQuestions[index].consumed <= 0) {
                    clearInterval(quizQuestions[index].timer);
                    quizQuestions[index].timer = null;
                    quizQuestions[index].consumed = 1;
                    selected[current_index] = "opt5";
                    if (current_index === 3) return results();
                    current_index++;
                    bootstrapApp(current_index);
                }
                loadTime(quizQuestions[index].consumed);
                quizQuestions[index].consumed--;
            }, 1000);
        }
        else {
            if (bg_timer > -1) {
                bg_interval = setInterval(() => {
                    if (bg_timer === 0) {
                        clearInterval(bg_interval);
                        clearInterval(quizQuestions[index].timer);
                        bg_timer = null;
                        quizQuestions[index].timer = null
                        bg_interval = null;
                        selected[current_index] = "opt5";
                        if (current_index === 3) return results();

                        current_index++;
                        quizQuestions[index].consumed = 0;
                    }
                    bg_timer--;
                }, 1000);
            }
            loadTime(quizQuestions[index].consumed);
        }
    }
};

const onNext = () => {
    let next_btn = document.getElementById("next-button");
    if (next_btn.disabled) return;
    quizQuestions[current_index].consumed++;
    if (current_index === 3) return results();

    current_index++;
    next_btn.disabled = true;
    let options = document.querySelectorAll('input[name=opt]');
    if (selected[current_index] || quizQuestions[current_index].consumed === 0) {
        options.forEach(opt => {
            opt.disabled = true;
        });
        next_btn.disabled = false;
    } else {
        options.forEach(opt => {
            opt.disabled = false;
            opt.checked = false;
        });
    }
    bootstrapApp(current_index);
};
const onPrevious = () => {
    let next_btn = document.getElementById("next-button");

    if (current_index === 0) return;
    bg_timer = quizQuestions[current_index].consumed;
    clearInterval(quizQuestions[current_index].timer);
    quizQuestions[current_index].timer = null;
    current_index--;
    bootstrapApp(current_index);

    next_btn.disabled = false;
    if (selected[current_index]) {
        let answers = document.querySelectorAll('input[name=opt]');
        let opts = document.querySelectorAll('label');
        opts.forEach((op, i) => {
            if (op.innerText === selected[current_index]) {
                answers[i].checked = true;
            }
        })
    }
    if (selected[current_index] || quizQuestions[current_index].consumed === 0) {
        let options = document.querySelectorAll('input[name=opt]');
        options.forEach(opt => {
            opt.disabled = true;
        });
    }
};

const bootstrapApp = (index) => {
    loadQuestion(index);
    startInterval(index);
};

const results = () => {
    alert(`You scored ${score}`)
};

bootstrapApp(current_index);