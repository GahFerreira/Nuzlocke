function new_run()
{
  document.getElementById("menu").remove();

  return new_route_box();
}

function new_route_box()
{
  // Creating the outer gray box
  new_box = document.createElement("div");
  new_box.className = "outer-gray-box containing-box";
  document.body.appendChild(new_box);

  // Creating the title that will hold the name of the route
  title_route = document.createElement("div");
  title_route.className = "title-route";

  route_name = document.createElement("p");
  route_name.innerText = "Route 01";

  title_route.appendChild(route_name);
  new_box.appendChild(title_route);

  // Creating the place where the pokemon image will be
  img_place = document.createElement("div");
  img_place.className = "img-place";
  new_box.appendChild(img_place);

  // Creating the input field where the pokemon name will be typed
  pokemon_input_place = document.createElement("div");
  pokemon_input_place.className = "pokemon-input-place";

  pokemon_field = document.createElement("input");
  pokemon_field.type = "text";
  pokemon_field.autofocus = true;

  pokemon_input_place.appendChild(pokemon_field);
  new_box.append(pokemon_input_place);
}

new_run_button = document.getElementById("new-run-button");

new_run_button.addEventListener("click", new_run);
