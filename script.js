document.addEventListener('DOMContentLoaded', function () {
    let quizData = null;
    fetch('quiz-data.json')
        .then(response => response.json())
        .then(data => {
            quizData = data
            initSections()
        })
        .catch(error => console.error('Error loading quiz data:', error));

    function initSections() {
        const sections = document.querySelectorAll(".section")
        sections.forEach(section => {
            section.addEventListener('click', () => {
                let sectionNumber = section.getAttribute("data-section")
                startQuiz(sectionNumber)
            })
        })
    }
    function startQuiz(index) {
        let currentQuestion = quizData.sections[index].questions;
        let currentQuestionIndex = 0;
        let score = 0;
        let answerSelected = false;

        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("question-container").style.display = "block";

        showQuestion()

        function showQuestion() {
            const question = currentQuestion[currentQuestionIndex];
            const questionElement = document.getElementById("question");
            const optionElement = document.getElementById("options");

            questionElement.textContent = question.question;
            optionElement.innerHTML = "";

            if (question.questionType === 'mcq') {
                question.options.forEach(option => {
                    const optionDiv = document.createElement("div");
                    optionDiv.textContent = option;
                    optionDiv.addEventListener('click', function () {
                        if (!answerSelected) {
                            answerSelected = true;
                            optionDiv.classList.add("selected")
                            checkAnswer(option, question.answer);
                        }
                    });
                    optionElement.appendChild(optionDiv);
                });
            }
            else {
                const inputElement = document.createElement("input");
                inputElement.type = question.questionType === 'number' ? 'number' : 'text';
                const submitButton = document.createElement("button");
                submitButton.textContent = 'Submit Answer';
                submitButton.className = "submit-answer";

                submitButton.onclick = () => {
                    if (!answerSelected) {
                        answerSelected = true;
                        checkAnswer(inputElement.value.toString(), question.answer.toString());
                    }
                };
                optionElement.appendChild(inputElement);
                optionElement.appendChild(submitButton);
            }
        }
        function checkAnswer(userAnswer, questionAnswer) {
            const feedbackElement = document.createElement("div");
            feedbackElement.id = "feedback";
            if (userAnswer == questionAnswer || userAnswer.toLowerCase() == questionAnswer.toLowerCase()) {
                score++;
                feedbackElement.textContent = 'Correct';
                feedbackElement.style.color = 'green';
            }
            else {
                feedbackElement.textContent = `Wrong answer! correct one is ${questionAnswer}`;
                feedbackElement.style.color = 'red';
            }
            const optionElement = document.getElementById("options");
            optionElement.appendChild(feedbackElement);
            updateScore();
        }
        function updateScore() {
            document.getElementById("score").textContent = 'Score' + score
        }

        document.getElementById("next-button").addEventListener('click', () => {
            if (currentQuestionIndex >= currentQuestion.length - 1) {
                console.log("quiz over")
                endQuiz();
            }
            else {
                currentQuestionIndex++;
                answerSelected = false;
                showQuestion();
            }
        })

        function endQuiz() {
            const questionContainer = document.getElementById("question-container");

            questionContainer.innerHTML = `
                <h1>Quiz Completed!</h1>
                <p>Your final score: ${score}/${currentQuestion.length}</p>
                <button id="home-button">Home</button>
            `;

            document.getElementById('home-button').addEventListener('click', function () {
                questionContainer.style.display = 'none';
                questionContainer.innerHTML = `
        <p id="score">Score: 0</p>
        <div id="question"></div>
        <div id="options"></div>
        <button id="next-button">Next</button>
    `;

                document.getElementById("quiz-container").style.display = 'grid';
            });
        }
    }


});

