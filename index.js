/**
 * @typedef Event
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2412-ftb-er-web-am";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let events = [];
let selectedEvent;

/** Updates state with all events from the API */
async function getEvents() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    events = result.data;
    render();
  } catch(e) {
    console.error("Error");
  }
}

/** Updates state with a single event from the API */
async function getEvent(id) {
  try {
    const response = await fetch(API + "/" + id);
    const result = await response.json();
    selectedEvent = result.data;
    render();
  } catch (e) {
    console.error("Error");
  }
}

// === Components ===

/** Event name that shows more details about the event when clicked */
function EventListItem(event) {
  const $li = document.createElement("li");
  $li.innerHTML = `
    <a>${event.name}</a>
    `;
    $li.addEventListener("click", () => getEvent(event.id));
    return $li;
}

/** A list of names of all events */
function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  const $events = events.map(EventListItem);
  $ul.replaceChildren(...$events);

  return $ul;
}

/** Detailed information about the selected event */
function EventDetails() {
  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent = "Please select an event to learn more.";
    return $p;
  }

  const $event = document.createElement("section");
  $event.classList.add("event");
  $event.innerHTML = `
    <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
    <p> ${selectedEvent.date}</p>
    <p> ${selectedEvent.location}</p>
    <p> ${selectedEvent.description}</p>
  `;
  return $event;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Fullstack Gala</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <eventList></eventList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <eventDetails></eventDetails>
      </section>
    </main>
  `;
  $app.querySelector("#selected").replaceWith(EventDetails());
  $app.querySelector("section:first-of-type").appendChild(EventList());
}

async function init() {
  await getEvents();
  render();
}

init();
