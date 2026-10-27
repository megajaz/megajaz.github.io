// console.debug("Hello world!");

class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.term = '';
        this.draw();
    }

    draw() {
        const container = document.getElementById("tasks-list");
        container.innerHTML = '';

        for(let i = 0; i < this.tasks.length; i++) {
            let li = document.createElement("li");

            // tresc zadania
            let spanText = document.createElement("span");
            spanText.textContent = this.tasks[i].text;
            if(this.term.length >= 2) {
                if(this.tasks[i].text.includes(this.term)) {
                    spanText.innerHTML = this.tasks[i].text.replace(this.term, "<mark>" + this.term + "</mark>");
                }
            }
            else {
                    spanText.textContent = this.tasks[i].text;
            }
            
            spanText.addEventListener("click", () => {
                this.editTask(i);
            })

            // data zadania
            let spanDate = document.createElement("span");
            spanDate.textContent = this.tasks[i].date;

            spanDate.addEventListener("click", () => {
                this.editTask(i);
            })

            // guzior do usuwania
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.classList.add("delete-btn");

            deleteBtn.addEventListener("click", () => {
                this.deleteTask(i);
            });

            // checkbox
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = this.tasks[i].completed;

            checkbox.addEventListener("change", () => {
                this.tasks[i].completed = checkbox.checked; 
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                this.draw();
            });

            li.appendChild(checkbox);
            li.appendChild(spanText);
            li.appendChild(spanDate);
            li.appendChild(deleteBtn);

            container.appendChild(li);
        }
    }

    addTask() {
        var inputBox = document.getElementById("task-input");
        var inputDate = document.getElementById("task-input-date").value;
        var invalidInput = false;
        // sprawdzanie tresci
        if(inputBox.value == '') {
            alert("Pole nie może być puste!");
            invalidInput = true;
        }
        if(inputBox.value != '') {
            if(inputBox.value.length < 3 || inputBox.value.length > 255) {
                alert("Tresc zadania musi miec co najmniej 3 znaki i nie moze byc dluzsza niz 255 znakow!");
                invalidInput = true
            }   
        }

        // sprawdzanie daty
        const todayDate = new Date().setHours(0,0,0,0);
        console.log(todayDate);
        if(inputDate !== '' && invalidInput == false) {
            var selectedDate = new Date(inputDate).setHours(0,0,0,0);

            if(selectedDate <= todayDate) {
                alert('Termin wykonania musi byc wyznaczony w przyszlosci!');
                invalidInput = true;
            }            
        }

        // zapisywanie zadanka
        if(invalidInput != true) {
            this.tasks.push({ 
                text: inputBox.value, 
                date: inputDate,
                completed: false
            });
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.draw();
            document.getElementById("task-input").value = '';
            document.getElementById("task-input-date").value = '';
        }
    }
    
    deleteTask(id) {
        // alert("deleteItem " + id);
        this.tasks.splice(id, 1);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.draw();
    }

    editTask(id) {
        // alert("edycja zadania numer" + id);
        
        const liItems = document.getElementById("tasks-list").children;
        const li = liItems[id];
        
        const spans = li.querySelectorAll("span");
        const spanText = spans[0];
        const spanDate = spans[1];

        // edycja nazwy zadania
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.value = this.tasks[id].text;

        // edycja daty
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = this.tasks[id].date || '';

        spanText.replaceWith(textInput);
        spanDate.replaceWith(dateInput);
        textInput.focus();

        // zapisywanie
        const saveChanges = () => {
            const newText = textInput.value.trim();
            const newDate = dateInput.value;
            let invalidInput = false;

            if (newText === '') {
                alert("Pole nie może być puste!");
                invalidInput = true;
            } else if (newText.length < 3 || newText.length > 255) {
                alert("Treść zadania musi mieć co najmniej 3 znaki i nie może być dłuższa niż 255 znaków!");
                invalidInput = true;
            }

            if (newDate !== '' && !invalidInput) {
                const todayDate = new Date().setHours(0, 0, 0, 0);
                const selectedDate = new Date(newDate).setHours(0, 0, 0, 0);

                if (selectedDate <= todayDate) {
                    alert('Termin wykonania musi być wyznaczony w przyszłości!');
                    invalidInput = true;
                }
            }

            if (!invalidInput) {
                this.tasks[id].text = newText;
                this.tasks[id].date = newDate;
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                this.draw();
            } else {
                this.draw();
            }
        };

        // zapis poprzez klikniecie gdzies poza
        li.addEventListener("focusout", (e) => {
            if (!li.contains(e.relatedTarget)) {
                saveChanges();
            }
        });
    }
}

list = new Todo();

var button = document.getElementById("button-add-task");
button.addEventListener("click", () => {list.addTask(); });

var search = document.getElementById("search-input");
search.addEventListener("input", (e) => {
                                        list.term = e.target.value; 
                                        list.draw();
                                        });