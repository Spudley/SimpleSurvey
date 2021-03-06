(function(w,d) {
    const surveyContainer = d.getElementById('surveyContainer');
    //@todo: hard-coded for now; be able to import question list from the api.
    var questions = [
        {
            name : 'age',
            caption: "Please tell us your age?",
            type: "select",
            options: ["Please select", "Under 18", "18-30", "31-45", "45-60", "60+"],
            validate: {minValue: 1},
            response: null
        },
        {
            name : 'pet',
            caption: "From the following list, which of these is your favourite animal?",
            type: "select",
            options: ["Please select", "Rabbits", "Cats", "Dogs", "Goldfish"],
            validate: {minValue: 1},
            response: null
        },
        {
            name : 'why',
            caption: "What do you like about this animal?",
            type: "textarea",
            validate: {minWords: 5},
            response: ''
        },
    ];
    var currentQuestion = 0;

    let displayQuestion = function(questionNum) {
        currentQuestion = questionNum;
        let question = questions[questionNum];
        surveyContainer.innerHTML = renderer.renderQuestion(question)
                                  + renderer.renderButtons(questionNum, questions);
        eventHandler.setup();
    };

    let storeAnswer = function(validationRequired) {
        let currentAnswer = d.getElementById('question_'+questions[currentQuestion].name).value;
        if (validationRequired) {
            if (!validate(questions[currentQuestion], currentAnswer)) {
                return false;
            }
        }
        questions[currentQuestion].response = currentAnswer;
        return true;
    };

    let validate = function(question, answer) {
        if (!question.validate) { return true; }
        if (question.validate.minValue) {
            let valid = (answer >= question.validate.minValue);
            if (!valid) {alert("Please select one of the options.");}
            return valid;
        }
        if (question.validate.minWords) {
            let valid = (answer.split(/\s+/).length >= question.validate.minWords);
console.log("min words is valid? "+(valid?'true':'false'));
            if (!valid) {alert("Please enter at least "+question.validate.minWords+" words.");}
            return valid;
        }
        return true;
    }


    let eventHandler = {
        setup: function() {
            let handler = this;
            d.querySelectorAll('.btn_jump').forEach(function(button) {
                button.addEventListener('click', handler.jump);
            });
            d.querySelectorAll('.btn_finish').forEach(function(button) {
                button.addEventListener('click', handler.finish);
            });
        },

        jump: function(event) {
            let button = event.target;
            let validationRequired = button.classList.contains('btn_validate');
            let destination = parseInt(button.id.replace('jumpto_',''));
            if (!storeAnswer(validationRequired)) {
                return;
            }
            displayQuestion(destination);
        },

        finish: function(event) {
            let button = event.target;
            let validationRequired = button.classList.contains('btn_validate');
            if (!storeAnswer(validationRequired)) {
                return;
            }

            var answers = {};
            questions.forEach(function(question) {
                answers[question.name] = question.response;
            });

            let xhr = new XMLHttpRequest();
            xhr.open('POST', './api');
            xhr.send(JSON.stringify(answers));

            xhr.onload = function() {
                let response = {};
                if (xhr.status == 200) {
                    response = JSON.parse(xhr.response);
                }
                if (response.result == 'success') {
                    alert("Done. Your survey submission has been accepted.");
                    return;
                }
                alert("Error: survey submission failed. Please try again, or contact us if the error persists.");
            };

            xhr.onerror = function() {
                alert("Error: survey submission failed. Please try again, or contact us if the error persists.");
            };
        }
    };

    let renderer = {
        renderQuestion: function(question) {
            let renderer = question.type + 'Render';
            return this[renderer](question);
        },

        selectRender: function(question) {
            var options = "";
            question.options.forEach(function(value, index) {
                let selected = (parseInt(question.response) === index) ? "selected='selected'" : "";
                options += "<option "+selected+" value='"+index+"'>"+value+"</option>";
            });
            return this.labelRender(question)
                 + "<select id='question_"+question.name+"'>"
                 + options
                 + "</select>";
        },

        textareaRender: function(question) {
            return this.labelRender(question)
                 + "<textarea id='question_"+question.name+"'>"
                 + question.response
                 + "</textarea>";
        },

        labelRender: function(question) {
            return "<label for='question_"+question.name+"'>"+question.caption+"</label>";
        },

        renderButtons: function(questionNum, questions) {
            let buttons = [
                (questionNum > 0 ? this.renderPrevButton(questionNum) : ''),
                (questionNum < questions.length-1 ? this.renderNextButton(questionNum) : ''),
                (questionNum === questions.length-1 ? this.renderFinishButton(questionNum) : ''),
            ];
            return "<div id='buttons'>"+buttons.join('')+"</div>";
        },

        renderPrevButton: function(questionNum) {
            return this.renderGenericButton('jumpto_'+(questionNum-1), 'btn_jump', "Previous");
        },

        renderNextButton: function(questionNum) {
            return this.renderGenericButton('jumpto_'+(questionNum+1), 'btn_jump btn_validate', "Next");
        },

        renderFinishButton: function(questionNum) {
            return this.renderGenericButton('finish', 'btn_finish btn_validate', "Finish");
        },

        renderGenericButton: function(id, cls, caption) {
            return "<button id='"+id+"' class='"+cls+"'>"+caption+"</button>";
        }
    }

    displayQuestion(currentQuestion);
})(window, document);
