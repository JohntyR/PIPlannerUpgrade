//#region Static Data
const numOfSprints = 6

var toastDict = {
    Dev: {
        "bg-colour": "bg-primary",
        "icon": "code-slash",
        "text": "Dev"
    },
    QA: {
        "bg-colour": "bg-success",
        "icon": "bug-fill",
        "text": "QA"
    },
    Dep: {
        "bg-colour": "bg-danger",
        "icon": "bezier2",
        "text": "Dep"
    }
};

var cardArray = ["Dev", "QA", "Dep"]

var boostrapColourArray = ["primary", "success", "danger", "warning"]
var colourCounter = 0
var defaultTShirt = 300
var defaultFeatureName = 'SomeApp v1.2'

var numOfDraggables = 0 //used to increment IDs given to draggable text-areas to have unique IDs for collapse data target

//#endregion

//#region utils
function colourIncrementer() {
    var colourNumber = colourCounter % (boostrapColourArray.length)
    colourCounter += 1
    return colourNumber
}
//#endregion

//#region AddFeature
AddFeatureBtns = document.querySelectorAll(".AddFeature");

AddFeatureBtns.forEach(addAddFeatureEvents);

function addAddFeatureEvents(AddFeatureBtn) {
    AddFeatureBtn.addEventListener('click', () => {
        var colourIncrement = colourIncrementer()
        var bootstrapColour = boostrapColourArray[colourIncrement]
        //Get main planner grid
        const mainGrid = document.querySelector('.grid-container')

        //Add Feature row-header div
        var featureHeaderContainer = createFeatureHeaderContainer(bootstrapColour)
        mainGrid.appendChild(featureHeaderContainer)

        //Add sprint containers
        for (let i = 0; i < numOfSprints; i++) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("sprint-container", `Sprint-${i + 1}`, 'border', `border-${bootstrapColour}`)
            newDiv.addEventListener('dragover', e => {
                e.preventDefault()
                const afterElement = getDragAfterElement(newDiv, e.clientY)
                const draggable = document.querySelector('.dragging')
                if (afterElement == null) {
                    newDiv.appendChild(draggable)
                } else {
                    newDiv.insertBefore(draggable, afterElement)
                }
            })
            mainGrid.appendChild(newDiv)
        }
    })
}

function createFeatureHeaderContainer(bootstrapColour) {
    //Create components of feature header card
    const newDiv = document.createElement("div");
    newDiv.classList.add('card', `text-${bootstrapColour}`, 'bg-light', 'mb-3', `border-${bootstrapColour}`)
    newDiv.setAttribute("style", "max-width: 18rem;")

    const newDivHeader = document.createElement("div");
    newDivHeader.classList.add('card-header')
    newDivHeader.setAttribute("contenteditable", "true")
    const newDivHeaderText = document.createTextNode(`T-Shirt: ${defaultTShirt}`)
    newDivHeader.appendChild(newDivHeaderText)

    const newDivBody = document.createElement("div");
    newDivBody.classList.add('card-body')

    const newDivTitle = document.createElement("h5");
    newDivTitle.classList.add('card-title')
    newDivTitle.setAttribute("contenteditable", "true")
    const newDivText = document.createTextNode(defaultFeatureName)
    newDivTitle.appendChild(newDivText)

    //append items to relevant parent elem
    newDivBody.appendChild(newDivTitle)
    newDiv.appendChild(newDivHeader)
    newDiv.appendChild(newDivBody)

    return newDiv
}
//#endregion

//#region Draggable creation, events, btn additions
function createDraggableToast(bgColour, iconType, toastType) {
    var newToast = document.createElement("div")
    newToast.classList.add('toast', 'show', 'draggable', 'text-white', 'mt-2', 'mx-4', `${toastType}-draggable`)
    newToast.setAttribute("draggable", "true")

    var toastHeader = document.createElement("div")
    toastHeader.classList.add('toast-header', 'text-white', bgColour)

    var toastIcon = document.createElement("div")
    toastIcon.classList.add('bi', `bi-${iconType}`)

    var toastText = document.createElement("strong")
    toastText.classList.add('me-auto', 'ms-2')
    toastText.innerHTML = toastType

    //Append all items to respective parent element
    toastHeader.appendChild(toastIcon)
    toastHeader.appendChild(toastText)

    newToast.appendChild(toastHeader)

    return newToast
}

draggables = document.querySelectorAll(".draggable");

draggables.forEach(addDraggableEvents);

function addDraggableEvents(draggable) {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        //remove style and add a close button
        draggable.classList.remove('dragging');

        //Add template of dropped card back to sidebar
        var templateContainer = document.querySelector('.template-container')
        var templateLIList = templateContainer.querySelectorAll('li')
        templateLIList.forEach((templateLI, i) => {
            if (templateLI.childElementCount == 0) {
                //add a template
                var cardName = cardArray[i]
                var newToast = createDraggableToast(
                    toastDict[cardName]["bg-colour"],
                    toastDict[cardName]["icon"],
                    toastDict[cardName]["text"]);
                templateContainer.querySelectorAll('li')[i].appendChild(newToast);
                addDraggableEvents(newToast);

                //Add estimate element that can be edited - add before close button - but not for dep draggables
                if (cardName == "Dev" || cardName == "QA") {
                    var draggableEstimate = document.createElement("input")
                    draggableEstimate.setAttribute("size", "2")
                    draggableEstimate.setAttribute("onclick", "this.select();")
                    //draggableEstimate.setAttribute("contenteditable", "true")
                    draggableEstimate.classList.add('my-auto', 'text-center', toastDict[cardName]["bg-colour"], 'bg-gradient', 'form-control', 'text-white', 'estimate-text')
                    //draggableEstimate.innerHTML = "10"
                    //draggableEstimate.addEventListener('click', () => {
                    //    this.select();
                    //})
                    //append to the draggable header
                    draggable.querySelector('.toast-header').appendChild(draggableEstimate)
                }

                //Also add a close button to the dropped draggable - will be the first time its placed
                attachCloseBTN(draggable);

                //Add a hideable detail text body section to the draggable
                var draggableID = `Draggable${numOfDraggables}`
                addTextBodyToDraggable(draggable, draggableID);
                addCollapseTargetToDraggableHeader(draggable, draggableID);
                numOfDraggables += 1

                //Only remove margin when its not dropped back in template container
                draggable.classList.remove('mx-4', 'mt-2');
                draggable.classList.add('mb-1');
            }
        })
    })
}

function attachCloseBTN(draggable) {
    var draggableCloseBTN = document.createElement("button");
    draggableCloseBTN.setAttribute("onclick", "this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;")
    draggableCloseBTN.setAttribute("type", "button");
    draggableCloseBTN.classList.add('btn-close', 'btn-close-white');

    //append close button to draggable header
    var draggableHeader = draggable.querySelector('.toast-header');
    draggableHeader.appendChild(draggableCloseBTN);
}

function addTextBodyToDraggable(draggable, draggableID) {
    var toastBody = document.createElement("div");
    toastBody.classList.add('text-black', 'collapse', 'draggable-body');
    toastBody.setAttribute("id", draggableID)

    var toastInput = document.createElement("text-area")
    toastInput.classList.add('form-control')
    toastInput.setAttribute("contenteditable", "true")

    toastBody.appendChild(toastInput);
    draggable.appendChild(toastBody);
}

function addCollapseTargetToDraggableHeader(draggable, draggableID) {
    var draggableTemplateTextArea = draggable.querySelector('.toast-header').querySelector('strong');
    draggableTemplateTextArea.setAttribute('data-bs-toggle', 'collapse')
    draggableTemplateTextArea.setAttribute('data-bs-target', `#${draggableID}`)
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}
//#endregion

//#region Calculate sprint load
ReCalculateBTNs = document.querySelectorAll(".ReCalculate");

ReCalculateBTNs.forEach(addReCalcEvents);

function addReCalcEvents(ReCalculateBTN) {
    ReCalculateBTN.addEventListener('click', () => {
        calcSprintLoad('Dev')
        calcSprintLoad('QA')
        calcSprintLoadTotal()
    })
}

function calcSprintLoad(toastType) {
    const sprintLoadDevElements = document.querySelectorAll(`.sprintLoad-${toastType}`)
    const sprintCapDevElements = document.querySelectorAll(`.sprintCapacity-${toastType}`)
    //Loop through each sprint and sum the estimate for each draggable
    for (let i = 0; i < numOfSprints; i++) {
        var sprintLoad = 0;

        //get containers in the ith sprint
        var sprintContainers = document.querySelectorAll(`.Sprint-${i + 1}`)

        sprintContainers.forEach(sprintContainer => {
            //get draggables in each sprint container
            var sprintDraggables = sprintContainer.querySelectorAll(`.${toastType}-draggable`)
            //loop through all draggables and increment sprint load by draggable estimate
            sprintDraggables.forEach(sprintDraggable => {
                var draggableEstimate = parseInt(sprintDraggable.querySelector('.estimate-text').value);
                sprintLoad = sprintLoad + draggableEstimate;
            })
        })

        //update sprint load
        sprintLoadDevElements[i].innerHTML = sprintLoad;

        //update colour if load is higher than capacity
        var sprintCapacity = parseInt(sprintCapDevElements[i].innerHTML)
        sprintLoad > sprintCapacity ? sprintLoadDevElements[i].classList.add('overLoaded') : sprintLoadDevElements[i].classList.remove('overLoaded');
    }
}

function calcSprintLoadTotal() {
    //get load and capcity elements from each sprint
    const loadTotalElements = document.querySelectorAll('.sprintLoad')
    const capacityTotalElements = document.querySelectorAll('.sprintCapacity')
    const sprintLoadDevElements = document.querySelectorAll('.sprintLoad-Dev')
    const sprintLoadQAElements = document.querySelectorAll('.sprintLoad-QA')

    //Loop through each sprint and sum the dev and qa loads
    for (let i = 0; i < numOfSprints; i++) {
        var sprintLoad = 0;
        sprintLoad += parseInt(sprintLoadDevElements[i].innerHTML) + parseInt(sprintLoadQAElements[i].innerHTML);

        //update total sprint load
        loadTotalElements[i].innerHTML = sprintLoad;

        //update colour if total load is higher than capacity
        var sprintCapacity = parseInt(capacityTotalElements[i].innerHTML)
        sprintLoad > sprintCapacity ? loadTotalElements[i].classList.add('overLoaded') : loadTotalElements[i].classList.remove('overLoaded');
    }
}
//#endregion

//#region Add new team member to capacity planner
AddTeamMemberBtns = document.querySelectorAll(".AddTeamMember");

AddTeamMemberBtns.forEach(addTeamMember)

function addTeamMember(AddTeamMemberBtn) {
    AddTeamMemberBtn.addEventListener('click', () => {
        //Create row of form controls and append to form
        var newRow = document.createElement("div");
        newRow.classList.add('row', 'mb-2', 'px-2')

        // Create team member name input
        var col1 = document.createElement("div")
        col1.classList.add('col-sm-5')

        var nameInput = document.createElement("input")
        nameInput.classList.add('form-control')
        nameInput.setAttribute("type", "text")
        nameInput.setAttribute("placeholder", "Team Member")

        col1.appendChild(nameInput)

        // Create Role dropdown input
        var col2 = document.createElement("div")
        col2.classList.add('col-sm')

        var roleDropdown = document.createElement("select")
        roleDropdown.classList.add('form-select')

        var dropdownOption1 = document.createElement("option")
        dropdownOption1.setAttribute("value", "1")
        dropdownOption1.innerHTML = "Dev"
        var dropdownOption2 = document.createElement("option")
        dropdownOption2.setAttribute("value", "2")
        dropdownOption2.innerHTML = "QA"

        roleDropdown.appendChild(dropdownOption1)
        roleDropdown.appendChild(dropdownOption2)
        col2.appendChild(roleDropdown)

        // Create capacity in hours input
        var col3 = document.createElement("div")
        col3.classList.add('col-sm')

        var capacityInput = document.createElement("input")
        capacityInput.classList.add('form-control')
        capacityInput.setAttribute("type", "text")
        capacityInput.setAttribute("placeholder", "Hours")

        col3.appendChild(capacityInput)

        // Create column for member days off
        var col4 = document.createElement("div")
        col4.classList.add('col-sm')

        var daysOffInput = document.createElement("input")
        daysOffInput.classList.add('form-control')
        daysOffInput.setAttribute("type", "text")
        daysOffInput.setAttribute("placeholder", "Days Off")

        col4.appendChild(daysOffInput)

        // Create delete button
        var col5 = document.createElement("div")
        col5.classList.add('col-sm')

        var deleteButton = document.createElement("button")
        deleteButton.classList.add('btn-outline-danger', 'btn')
        deleteButton.innerHTML = "Delete"
        deleteButton.setAttribute("type", "button")
        deleteButton.setAttribute("onclick", "this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;")

        col5.appendChild(deleteButton)

        // Append all columns to parent row
        newRow.appendChild(col1)
        newRow.appendChild(col2)
        newRow.appendChild(col3)
        newRow.appendChild(col4)
        newRow.appendChild(col5)

        // Append new row to form
        var capacityForm = document.querySelector('.capacity-form')
        var teamDaysOffRow = document.querySelector('.TeamDaysOff-row')
        capacityForm.insertBefore(newRow, teamDaysOffRow)
    })
}
//#endregion
