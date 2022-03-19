function new_run()
{
  document.getElementById("menu").remove();

  return new_route_box();
}

function new_route_box()
{
  // Creating the outer gray box
  const new_box = document.createElement("div");
  new_box.className = "outer-gray-box containing-box";
  document.body.appendChild(new_box);

  // Creating the title that will hold the name of the route
  const route_name = document.createElement("p");
  route_name.className = "title-route";
  route_name.innerText = "Route 01";

  new_box.appendChild(route_name);

  // Creating the place where the pokemon image will be
  const img_place = document.createElement("div");
  img_place.className = "img-place";
  new_box.appendChild(img_place);

  // Creating the input field where the pokemon name will be typed
  const pokemon_field = document.createElement("input");
  pokemon_field.className = "pokemon-input-place";
  pokemon_field.type = "text";
  pokemon_field.setAttribute("maxlength", 12);
  // pokemon_field.autofocus = true;
  new_box.appendChild(pokemon_field);

  // Creating the dropdown menu to control pokemon state
  const state_dropdown = document.createElement("select");
  state_dropdown.className = "state-dropdown";

  const states = ["team", "boxed", "fainted", "escaped"];
  states.className = "state-dropdown";

  for (const state of states)
  {
    const new_option = document.createElement("option");
    new_option.value = state;
    new_option.text = state.charAt(0).toUpperCase() + state.slice(1);
    state_dropdown.appendChild(new_option);
  }

  new_box.appendChild(state_dropdown);
}

const new_run_button = document.getElementById("new-run-button");

new_run_button.addEventListener("click", new_run);
