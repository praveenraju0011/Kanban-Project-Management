let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let textAreaCont = document.querySelector(".textArea-cont");
let mainCont = document.querySelector(".main-cont");
let removeBtn = document.querySelector(".remove-btn");
let toolboxColors = document.querySelectorAll(".color");
//variables
let addTaskFlag = false;
let removeTaskFlag = false;
let modalPriorityColor = "lightpink";
let lockIconClass = "fa-lock";
let unlockIconClass = "fa-lock-open";
let colors = ["lightpink", "lightgreen", "lightblue", "black"];
let ticketArray = [];

//modal onclick display and hidden
addBtn.addEventListener("click", (event) => {
  addTaskFlag = !addTaskFlag;
  if (addTaskFlag) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});

//Selecting Ticket Color
allPriorityColors.forEach((colorEle) => {
  colorEle.addEventListener("click", (event) => {
    //remove the active on all divs

    allPriorityColors.forEach((priorityColor) => {
      priorityColor.classList.remove("active");
    });
    //apply on clicked div element
    colorEle.classList.add("active");

    modalPriorityColor = colorEle.classList[0];
  });
});

// Ticket Creation
modalCont.addEventListener("keydown", (event) => {
  let keyPressed = event.key;

  if (keyPressed === "Shift") {
    //ticket Creation
    let ticketDesc = textAreaCont.value;

    //let tickedId = shortid();

    createTicket(modalPriorityColor, ticketDesc);

    addTaskFlag = !addTaskFlag;
    textAreaCont.value = "";
  }
});

//Create Ticket Function
function createTicket(ticketColor, ticketDesc, ticketId) {
 
  let id = ticketId || shortid();
 
  let ticketCont = document.createElement("div");

  ticketCont.classList.add("ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div><div class="ticket-id">${id}</div><div class="task-area">${ticketDesc}</div><div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;
  mainCont.appendChild(ticketCont);
  modalCont.style.display = "none";

  let ticketMetaData = {
    ticketColor,
    ticketId: id,
    ticketDesc,
  };

  if (!ticketId) {
    ticketArray.push(ticketMetaData);
    localStorage.setItem("tickets", JSON.stringify(ticketArray));
  }

  handleRemoveTicket(ticketCont);
  handleLock(ticketCont);
  handleColor(ticketCont);
}

//remove ticket
removeBtn.addEventListener("click", (event) => {
  removeTaskFlag = !removeTaskFlag;
  if (removeTaskFlag == true) {
    alert("Delete Mode is activated");
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "white";
  }
});

function handleRemoveTicket(ticket) {
  ticket.addEventListener("click", (event) => {
    if (removeTaskFlag) {
      let text = "Press a button!\nEither OK or Cancel.";
      if (confirm(text) == true) {
        let ticketIdIndex = ticketArray.findIndex((t) => {
          return t.ticketId == ticket.ticketId;
        });
        ticketArray.splice(ticketIdIndex, 1);
        //update local storage
        localStorage.setItem("tickets", JSON.stringify(ticketArray));

        //remove ticket
        ticket.remove();
      }
    } else {
      return;
    }
   
  });
}

//Lock mechanism
function handleLock(ticket) {
  let ticketLockEle = ticket.querySelector(".ticket-lock");
  let ticketLockIcon = ticketLockEle.children[0];
  let taskArea = ticket.querySelector(".task-area");

  ticketLockIcon.addEventListener("click", () => {
    if (ticketLockIcon.classList.contains(lockIconClass)) {
      ticketLockIcon.classList.remove(lockIconClass);
      ticketLockIcon.classList.add(unlockIconClass);
      taskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLockIcon.classList.remove(unlockIconClass);
      ticketLockIcon.classList.add(lockIconClass);
      taskArea.setAttribute("contenteditable", "false");

      //ticket Desc update
      let updDescTicketId = ticket.children[1].innerText;

      ticketArray.forEach((t) => {
        if (t.ticketId == updDescTicketId) {
          t.ticketDesc = taskArea.innerText;
        }
      });
      //update local storage
      localStorage.setItem("tickets", JSON.stringify(ticketArray));
    }
  });
}

function handleColor(ticket) {
  let ticketColorBand = ticket.querySelector(".ticket-color");

  ticketColorBand.addEventListener("click", () => {
    let currentColor = ticketColorBand.classList[1];

    let currentIndexColor = colors.findIndex((color) => {
      return color == currentColor;
    });
    currentIndexColor++;
    let newColorIndex = currentIndexColor % colors.length;
    let newColor = colors[newColorIndex];

    ticketColorBand.classList.remove(currentColor);

    ticketColorBand.classList.add(newColor);

    let updColorTicketId = ticket.children[1].innerText;

    ticketArray.forEach((t) => {
      if (t.ticketId == updColorTicketId) {
        t.ticketColor = newColor;
      }
    });

    //update local storage
    localStorage.setItem("tickets", JSON.stringify(ticketArray));
  });
}

//Filter Function
toolboxColors.forEach((toolboxColor) => {
  toolboxColor.addEventListener("click", () => {
    let selectedToolBoxColor = toolboxColor.classList[0];

    let filteredTickets = ticketArray.filter((ticket) => {
      return selectedToolBoxColor == ticket.ticketColor;
    });

    let allTickets = document.querySelectorAll(".ticket-cont");

    allTickets.forEach((ticket) => {
      ticket.remove();
    });

    filteredTickets.forEach((filteredTicket) => {
      createTicket(
        filteredTicket.ticketColor,
        filteredTicket.ticketDesc,
        filteredTicket.ticketId
      );
    });
  });

  toolboxColor.addEventListener("dblclick", () => {
    let allTickets = document.querySelectorAll(".ticket-cont");

    allTickets.forEach((ticket) => {
      ticket.remove();
    });

    ticketArray.forEach((ticket) => {
      createTicket(ticket.ticketColor, ticket.ticketDesc, ticket.ticketId);
    });
  });
});

//local storage
let ticketLocalStorage = localStorage.getItem("tickets");
if (ticketLocalStorage) {
  ticketArray = JSON.parse(ticketLocalStorage);
  ticketArray.forEach((ticket) => {
    createTicket(ticket.ticketColor, ticket.ticketDesc, ticket.ticketId);
  });
}
