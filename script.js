import { poke_data } from "./js/pokedata.js";

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

	// Creating the place where the pokemon selection will be
	const pokemon_select_wrapper = document.createElement("div");
	pokemon_select_wrapper.className = "pokemon-select-wrapper";
	new_box.appendChild(pokemon_select_wrapper);

	// Creating the input field where the pokemon name will be typed
	const pokemon_input_field = document.createElement("input");
	pokemon_input_field.className = "pokemon-input-field";

	pokemon_input_field.setAttribute("maxlength", 12);
	pokemon_input_field.setAttribute("placeholder", "Pokémon...");

	// When the input field gets focused, it's ready to be typed in and we have to consider two cases:
	//   If no pokemon had been previously selected, the placeholder shows "Pokemon..."
	//	 If any pokemon has been previously selected, the placeholder shows the most recent pokemon's name
	// Also, the input field has to be cleared, so the value is set to an empty string
	pokemon_input_field.addEventListener("focus", () =>
	{
		pokemon_input_field.placeholder = (pokemon_input_field.value !== "") ? pokemon_input_field.value : "Pokémon...";

		pokemon_input_field.value = "";
	});

	// When the input field gets out of focus, we have to consider two cases:
	//   A new pokemon was selected from the list
	//     In this case, the value of the input field becomes that pokemon's name
	//   No new pokemon was selected from the list
	//     In this case, we have two possibilites:
	//       A pokemon had already been selected before: its name becomes the value again
	//       No pokemon had been selected before: no value and the placeholder becomes "Pokemon..."
	pokemon_input_field.addEventListener("blur", () =>
	{
		console.log("Blur up!");

		pokemon_input_field.value = (pokemon_input_field.placeholder !== "Pokémon...") ? pokemon_input_field.placeholder : "";

		pokemon_input_field.placeholder = (pokemon_input_field.value !== "") ? pokemon_input_field.value : "Pokémon...";
	});

	pokemon_select_wrapper.appendChild(pokemon_input_field);

	// Creating the pokemon list dropdown
	const pokemon_list = document.createElement("ul");
	pokemon_list.className = "pokemon_list";

	for (const { name, value, image } of poke_data.slice(0, 9))
	{
		const new_list_item = document.createElement("li");
		// new_list_item.id = name;

		const new_option = document.createElement("div");
		new_option.className = "option";

		// 'alt' was set to "" so non-visual browsers may omit it from rendering (it's decoration after all)
		const new_icon = document.createElement("img");
		new_icon.src = image;
		new_icon.setAttribute("alt", "");
		new_option.appendChild(new_icon);

		const pokemon_name = document.createElement("p");
		pokemon_name.innerText = name;
		new_option.appendChild(pokemon_name);

		new_list_item.appendChild(new_option);

		new_list_item.addEventListener("mousedown", () => console.log("MouseDown!"));

		new_list_item.addEventListener("click", () =>
		{
			pokemon_input_field.value = name;
			console.log(`${name} was clicked!`);
		});

		pokemon_list.appendChild(new_list_item);
	}

	pokemon_select_wrapper.appendChild(pokemon_list);

	// Creating the dropdown menu to control pokemon state
	const state_dropdown_wrapper = document.createElement("div");
	state_dropdown_wrapper.className = "state-dropdown-wrapper";

	const state_dropdown = document.createElement("select");
	state_dropdown.className = "state-dropdown";

	const states = ["team", "boxed", "fainted", "escaped"];

	for (const state of states)
	{
		const new_option = document.createElement("option");
		new_option.value = state;
		new_option.text = state.charAt(0).toUpperCase() + state.slice(1);
		state_dropdown.appendChild(new_option);
	}

	state_dropdown_wrapper.appendChild(state_dropdown);
	new_box.appendChild(state_dropdown_wrapper);
}

const new_run_button = document.getElementById("new-run-button");

new_run_button.addEventListener("click", new_run);