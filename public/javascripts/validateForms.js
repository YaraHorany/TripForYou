// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

function next() {
    const parent = document.querySelector('#parent');
    let numOfDays = document.querySelector('#numOfDays');
    let oldVal = Number(numOfDays.oldvalue);
    let returnedAnswer = true;
    const text = "Changing your answer may lead to loss of data you already entered. \nare you sure you want to continue?"
    if (numOfDays.value < oldVal) {
        returnedAnswer = window.confirm(text);
        if (returnedAnswer == false) {
            numOfDays.value = numOfDays.oldvalue;
        } else {
            if (numOfDays.value < 0) {
                numOfDays.value = 1;
            }
            for (i = oldVal; i > numOfDays.value; i--) {
                parent.removeChild(parent.lastElementChild);
            }
        }
    }
    else {
        for (let i = oldVal; i < numOfDays.value; i++) {
            let div = document.createElement("div");
            div.className = "mb-3";

            let dayParagraph = document.createElement("p");
            dayParagraph.innerHTML = `Day ${i + 1}`

            let descriptionLabel = document.createElement("label");
            descriptionLabel.innerHTML = "Description"
            descriptionLabel.className = "form-label";
            descriptionLabel.htmlFor = `description${i + 1}`;

            let textarea = document.createElement("textarea");
            textarea.className = "form-control";
            textarea.type = "text";
            textarea.id = `description${i + 1}`;
            textarea.name = `trip[daysProgram][${i}]`;

            parent.appendChild(div);
            div.appendChild(dayParagraph);
            div.appendChild(descriptionLabel);
            div.appendChild(textarea);
        }
    }
}
