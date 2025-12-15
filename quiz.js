document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const resultsContainer = document.getElementById('quiz-results');

    const audioSuccess = new Audio('OST/Vitoria.mp3');
    const audioFail = new Audio('OST/Dumb.mp3');

    const correctAnswers = {
        q1: 'c',
        q2: 'b',
        q3: 'd',
        q4: 'a',
        q5: 'c',
        q6: 'b',
        q7: 'a',
        q8: 'a',
        q9: 'c',
        q10: 'b'
    };

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let score = 0;
        const totalQuestions = Object.keys(correctAnswers).length;
        const formData = new FormData(quizForm);

        const allLabels = quizForm.querySelectorAll('label.option-item');
        allLabels.forEach(label => {
            label.classList.remove('correct', 'incorrect');
        });

        for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
            const userAnswer = formData.get(question);

            const questionElement = document.querySelector(`input[name="${question}"]`)
                ?.closest('.quiz-question');

            if (questionElement) {
                const labels = questionElement.querySelectorAll('label.option-item');

                labels.forEach(label => {
                    const input = label.querySelector('input');

                    if (input.value === correctAnswer) {
                        label.classList.add('correct');
                    }

                    if (input.checked && input.value !== correctAnswer) {
                        label.classList.add('incorrect');
                    }
                });
            }

            if (userAnswer === correctAnswer) {
                score++;
            }
        }

        resultsContainer.style.display = 'block';
        resultsContainer.textContent = `Você acertou ${score} de ${totalQuestions} perguntas!`;

        audioSuccess.pause();
        audioFail.pause();
        audioSuccess.currentTime = 0;
        audioFail.currentTime = 0;

        if (score >= 6) {
            resultsContainer.className = 'success';
            audioSuccess.play();
        } else {
            resultsContainer.className = 'fail';
            audioFail.play();
        }
    });
});