document.addEventListener('DOMContentLoaded',function(){
    let quizData = null;
    fetch('quiz-data.json')
    .then(response=>response.json())
    .then(data=>{
        quizData = data
        initSections()
    })
    .catch(error=>console.error('Error loading quiz data:',error));

    function initSections(){
        const sections = document.querySelectorAll(".section")
        sections.forEach(section=>{
            section.addEventListener('click',()=>{
                let sectionNumber = section.getAttribute("data-section")
                startQuiz(sectionNumber)
            })
        })
}
    function startQuiz(index){
        let currentQuestion = quizData.sections[index].questions;
        let currentQuestionIndex = 0;
        let score = 0;
        let answerSelected = false;

        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("question-container").style.display = "block";

        showQuestion()

        function showQuestion(){
            document.getElementById("question").textContent = currentQuestion[currentQuestionIndex].question;
        }

        document.getElementById("next-button").addEventListener('click',()=>{
            if(currentQuestionIndex>=currentQuestion){
                console.log("quiz over")
            }
            else{
            currentQuestionIndex++;
            showQuestion(); 
            }
        })
    }

  
});

