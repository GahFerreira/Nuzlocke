import { poke_data } from "./js/pokedata.js";

/**
 * Function assigned to the "New Run" button in the main page when it is selected
 */
function new_run()
{
	document.getElementById("main-menu").remove();

	const first_route_box = route_box_factory("Route 01");
	first_route_box.build_route_box();
}

/**
 * Class declaration, using Factory Design Pattern, of Route Box.
 * 
 * @param {string} route_name Name of the route.
 * @returns A new Route Box object.
 */
const route_box_factory = (route_name) =>
{
	/**
	 * Creates a `<div>` that will contain all elements of the Route Box.
	 * 
	 * @returns A new containing box HTML element.
	 */
	function Containing_Box()
	{
		const containing_box = document.createElement("div");
		containing_box.className = "outer-gray-box containing-box";

		return containing_box;
	}

	/**
	 * Creates a `<div>` that is a circle and appends an `<img>` to it which holds the image of the pokemon.
	 * 
	 * @returns A new pokemon image holder HTML element.
	 */
	function Pokemon_Image_Holder()
	{
		// The circle which contains inside it the pokemon image
		const pokemon_image_holder = document.createElement("div");
		pokemon_image_holder.className = "pokemon-image-holder";

		// The pokemon image
		const pokemon_image = document.createElement("img");

		pokemon_image_holder.appendChild(pokemon_image);
		pokemon_image_holder.pokemon_image = pokemon_image;

		return pokemon_image_holder;
	}

	/**
	 * Creates a `<p>` that shows the name of the route as a title in the Route Box.
	 * 
	 * @param {string} route_name Name of the route.
	 * @returns A new route title HTML element.
	 */
	function Route_Title(route_name)
	{
		const route_title = document.createElement("p");
		route_title.className = "route-title";
		route_title.innerText = route_name;

		return route_title;
	}

	/**
	 * Creates an `<input>` that is meant for searching pokemon by their name and storing the name of the selected pokemon.
	 * 
	 * @returns A new pokemon input field HTML element.
	 */
	function Pokemon_Input_Field()
	{
		const pokemon_input_field = document.createElement("input");
		pokemon_input_field.className = "pokemon-input-field";

		pokemon_input_field.setAttribute("maxlength", 12);
		pokemon_input_field.setAttribute("placeholder", "Pokémon...");

		return pokemon_input_field;
	}

	/**
	 * Assigns events to the pokemon input field HTML element.
	 * 
	 * @param {HTMLInputElement} pokemon_input_field The HTML element that receives the events.
	 * @param {HTMLUListElement} pokemon_list The pokemon list HTML element that holds all pokemon as list items.
	 * @param {object} route_box A reference to the Route Box object. Its purpose is to read the current selected pokemon, which is always `undefined` if passed directly to the function.
	 */
	function assign_pokemon_input_field_events(pokemon_input_field, pokemon_list, route_box)
	{
		/**
		 * When the input field gets focused, it should be ready to be typed in
		 * Then we have to consider two cases:
		 *   - If no pokemon had been previously selected, the placeholder shows "Pokemon..."
		 *   - If any pokemon has been previously selected, the placeholder shows the most recent pokemon's name
		 * Also, the input field has to be cleared, so the value is set to an empty string
		 */
		pokemon_input_field.addEventListener("focus", () =>
		{
			/** 
			 * Makes all pokemon visible in the list.
			 * 
			 * Ideally this should happen when the pokemon list gets out of focus, but this 
			 * implementation suffices for now.
			*/
			for (const list_item of pokemon_list.childNodes)
			{
				list_item.classList.remove("off");
			}

			if (route_box.selected_pokemon === undefined)
			{
				pokemon_input_field.placeholder = "Pokémon...";
			}

			else
			{
				pokemon_input_field.placeholder = pokemon_input_field.value;
			}

			pokemon_input_field.value = "";
		});

		/**
		 * When the input field gets out of focus, ideally it should hold the name of the most recent selected pokemon as its value.
		 * 
		 * It can get out of focus in two cases:
		 * 
		 *   1. The user has focused another element that is not a pokemon from the list.
		 * 
		 *     In this case, we have to look at two possibilities:
		 *       1.1 No pokemon has been previously selected
		 *         The value has to become empty and the placeholder has to show "Pokemon...".
		 *       1.2 A pokemon has been previously selected
		 *         The value should simply become the name of the current selected pokemon.
		 *       
		 *   2. The user is selecting a pokemon from the list.
		 * 
		 *     This case is special, because the `blur` event will be called before the `click` 
		 *     event that actually updates the selected pokemon. 
		 *     When the `click` event is fired, it will update the value of the input field.
		 * 
		 *     In this case, we have to look at two possibilities:
		 *       2.1 No pokemon has been previously selected
		 *         2.1.1 While the user is still holding the click: the value has to become 
		 *           empty and the placeholder has to show "Pokemon...".
		 *         2.1.2 After the user chooses the pokemon: the value should simply become the 
		 *           name of the newly selected pokemon.
		 *       2.2 A pokemon has been previously selected
		 *         2.2.1 While the user is still holding the click: the value should be emptied 
		 *           and the placeholder should show the name of the current selected pokemon.
		 *         2.2.2 After the user chooses the pokemon: the value should simply become the 
		 *           name of the newly selected pokemon.
		 *   
		 *   Since `click` already updates the value after selecting a new pokemon from the 
		 *   list, we can see that:
		 *     - 1.1 and 2.1 are equal
		 *     - 1.2 and 2.2 only differ while the user is holding the click
		 * 
		 *   We can converge 1.2 and 2.2 by simply always changing the value to the name of the 
		 *   current selected pokemon, with the following step:
		 *     While the user is holding the click on a pokemon from the list, we can color 
		 *     the input field value to the same color as the placeholder.
		 *     This way, to the user, it would look the same as if value was emptied and 
		 *     placeholder showed the name of the current selected pokemon.
		 *   
		 *   The CSS rule that helps in this convergence has the following selector:
		 *   `.pokemon-selection-wrapper:active .pokemon-input-field`
		 */
		pokemon_input_field.addEventListener("blur", () =>
		{
			if (route_box.selected_pokemon === undefined)
			{
				pokemon_input_field.value = "";
				pokemon_input_field.placeholder = "Pokémon...";
			}

			else
			{
				pokemon_input_field.value = pokemon_input_field.placeholder;
			}
		});

		/**
		 * Whenever the input updates, the pokemon_list should show only pokemon that match the input.
		 * 
		 * A match happens when the input is substring of a pokemon name.
		 * Both the input and the pokemon name are turned to lowercase before trying to match.
		 * 
		 * Note: 
		 *   The function called when `input` triggers is impure. It changes the state of 
		 *   `pokemon_list`, more specifically its child nodes. There might be a better way to 
		 *   implement this, without relying on an impure function. 
		 * 
		 *   Also notice that performance was an important consideration in favor of a more 
		 *   direct implementation, since this event can be fired multiple times per second.
		 */
		pokemon_input_field.addEventListener("input", (e) =>
		{
			/**
			 * Tries to match an input string to a pokemon name.
			 * 
			 * Notice that the input_string may be a non-contiguous substring of the pokemon name.
			 * This means that "pkc" matches "pikachu" and "r" matches "bulbasaur".
			 * However "pck" does not match "pikachu" and "ru" does not match "bulbasaur".
			 * 
			 * @param {string} input_string The input given by the user.
			 * @param {string} pokemon_name The name of pokemon to match.
			 * @returns {boolean} `true` if `input_string` is substring of `pokemon_name`, `false` otherwise.
			 */
			function match_pokemon_name(input_string, pokemon_name)
			{
				for (let i_input_string = 0, i_pokemon_name = 0; i_pokemon_name < pokemon_name.length; i_pokemon_name++)
				{
					if (input_string[i_input_string] === pokemon_name[i_pokemon_name])
					{
						i_input_string++;

						if (i_input_string === input_string.length)
						{
							return true;
						}
					}
				}

				return false;
			}

			/**
			 * `input_string` is the input typed in the input field.
			 * It's converted to lowercase and normalized in "NFKC".
			 * This normalization means that characters such as "é" are in the "é" form and not 
			 * "e´" form and characters such as "ﬀ" are treated as "ff".
			 */
			const input_string = e.target.value.toLowerCase().normalize("NFKC");

			// The empty string matches all pokemon, so no point in trying to match
			if (input_string == "")
			{
				for (const list_item of pokemon_list.childNodes)
				{
					list_item.classList.remove("off");
				}

				return;
			}

			for (const list_item of pokemon_list.childNodes)
			{
				/**
				 * Pokemon name is converted to lower case and normalized in "NFC".
				 * This normalization means that characters such as "é" are in the "é" form and 
				 * not "e´" form.
				 */
				const pokemon_name = list_item.pokemon_data.name.toLowerCase().normalize();

				let match = match_pokemon_name(input_string, pokemon_name);

				/**
				 * Pokemon with non english letters in their name should, alongside matching 
				 * their name with the right character, also match an input that has an 
				 * equivalent english letter in its place. This is meant to improve UX.
				 * 
				 * For example, the Pokemon "Flabébé":
				 *   - It should of course match an input like "Flabé".
				 *   - It also should match an input like "Flabe".
				 *
				 * Therefore, if a match hasn't occurred with the true pokemon name, it checks
				 * if the name is any different using only english characters, and if it is, it
				 * tries to rematch.
				 */
				if (match === false)
				{
					// `[\u0300-\u036f]/g` matches all diacritical characters, such as "´".
					const eng_pokemon_name = pokemon_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

					if (pokemon_name !== eng_pokemon_name)
					{
						match = match_pokemon_name(input_string, eng_pokemon_name);
					}
				}

				if (match === true)
				{
					list_item.classList.remove("off");
				}

				else
				{
					list_item.classList.add("off");
				}
			}
		});
	}

	/**
	 * Creates an `<ul>` that drops down when the input field is focused and appends to it one `<li>` for each pokemon. Each `<li>` is composed of a `<div>`, which determines the click area for that list item, an `<img>` to show the pokemon sprite and a `<p>` to show the pokemon name.
	 * 
	 * @returns A new pokemon list HTML element.
	 */
	function Pokemon_List()
	{
		// Creating the pokemon list dropdown
		const pokemon_list = document.createElement("ul");
		pokemon_list.className = "pokemon-list";

		/**
		 * This iterates over the poke_data array, which contains the data of all pokemon
		 * For each pokemon, a new list item is created for it, and appended to pokemon_list
		 */
		for (const { name, image } of poke_data/*.slice(0, 9)*/)
		{
			const list_item = document.createElement("li");
			list_item.pokemon_data = { name, image };

			const click_area = document.createElement("div");
			click_area.className = "click-area";

			// 'alt' was set to "" so non-visual browsers may omit it from rendering (it's decoration after all)
			const pokemon_icon = document.createElement("img");

			// Assigning `.src` to near 1000 pokemon is really slow to performance and should be done in a better way
			pokemon_icon.src = image;

			pokemon_icon.setAttribute("alt", "");

			const pokemon_name = document.createElement("p");
			pokemon_name.innerText = name;

			click_area.appendChild(pokemon_icon);
			click_area.appendChild(pokemon_name);

			list_item.appendChild(click_area);
			list_item.click_area = click_area;

			pokemon_list.appendChild(list_item);
		}

		return pokemon_list;
	}

	/**
	 * Assigns events to the pokemon list HTML element.
	 * 
	 * @param {HTMLUListElement} pokemon_list The pokemon list HTML element that holds the list items which will receive the events.
	 * @param {HTMLInputElement} pokemon_input_field The pokemon input field HTML element, which will be updated when the `click` event is fired on a list item.
	 * @param {HTMLImageElement} pokemon_image The pokemon image HTML element, which will be updated when the `click` event is fired on a list item.
	 * @param {object} route_box A reference to the Route Box object. Its purpose is to update the selected pokemon, which doesn't update properly if passed directly to the function.
	 */
	function assign_pokemon_list_events(pokemon_list, pokemon_input_field, pokemon_image, route_box)
	{
		// This implementation iterates over the map, without declaring the keys (which wouldn't be used anyway)
		for (const list_item of pokemon_list.childNodes)
		{
			// list_item.click_area.addEventListener("mousedown", () => console.log("MouseDown!"));

			list_item.click_area.addEventListener("click", () =>
			{
				// console.log(`${list_item.pokemon_data.name} was clicked!`);

				route_box.selected_pokemon = list_item.pokemon_data.name;
				pokemon_input_field.value = list_item.pokemon_data.name;

				// Adds pokemon image to left circle
				pokemon_image.src = list_item.pokemon_data.image;

				// console.log(`Current selected pokemon = ${route_box.selected_pokemon}`);
			});
		}
	}

	/**
	 * Creates a `<div>` that wraps both the `<input>` that defines the pokemon input field and the `<ul>` that defines the pokemon list.
	 * 
	 * @returns A new pokemon select wrapper HTML element.
	 */
	function Pokemon_Selection_Wrapper()
	{
		const pokemon_selection_wrapper = document.createElement("div");
		pokemon_selection_wrapper.className = "pokemon-selection-wrapper";

		// The input field where the pokemon name will be typed
		const pokemon_input_field = Pokemon_Input_Field();

		// The pokemon list that drops down when the input field is in focus
		const pokemon_list = Pokemon_List();

		pokemon_selection_wrapper.appendChild(pokemon_input_field);
		pokemon_selection_wrapper.appendChild(pokemon_list);

		pokemon_selection_wrapper.pokemon_input_field = pokemon_input_field;
		pokemon_selection_wrapper.pokemon_list = pokemon_list;

		return pokemon_selection_wrapper;
	}

	/**
	 * Creates a `<div>` that wraps a `<select>` field, that represents the state dropdown, which is filled with an `<option>` for each state.
	 * 
	 * @returns A new state dropdown wrapper HTML element.
	 */
	function State_Dropdown()
	{
		// Creating the dropdown menu to control pokemon state
		const state_dropdown_wrapper = document.createElement("div");
		state_dropdown_wrapper.className = "state-dropdown-wrapper";

		const state_dropdown = document.createElement("select");
		state_dropdown.className = "state-dropdown";

		const states = ["team", "boxed", "fainted", "escaped"];

		for (const state of states)
		{
			const state_option = document.createElement("option");
			state_option.value = state;
			state_option.text = state.charAt(0).toUpperCase() + state.slice(1);
			state_dropdown.appendChild(state_option);
		}

		state_dropdown_wrapper.appendChild(state_dropdown);

		return state_dropdown_wrapper;
	}

	/**
	 * Creates the html object that is a property of Route Box. This object contains all HTML objects which together make a Route Box in the website.
	 * 
	 * @param {string} route_name Name of the route.
	 * @returns A new object that contains all HTML fields of the Route Box.
	 */
	function Route_Box_html(route_name)
	{
		// The outer box that will contain all HTML elements
		const containing_box = Containing_Box();

		// A title for the Route Box, indicating the route name
		const route_title = Route_Title(route_name);

		// The circle that holds the image of the selected pokemon
		const pokemon_image_holder = Pokemon_Image_Holder();

		// This wraps both the text input field and the list it creates when it's in focus
		const pokemon_selection_wrapper = Pokemon_Selection_Wrapper();

		// The state dropdown that shows the state of the pokemon
		const state_dropdown = State_Dropdown();

		const html =
		{
			// All of the below properties are equivalent to `property: property`
			containing_box,
			route_title,
			pokemon_image_holder,
			pokemon_selection_wrapper,
			state_dropdown
		}

		return html;
	}

	const html = Route_Box_html(route_name);

	const route_box =
	{
		route_name: route_name,
		selected_pokemon: undefined,
		html: html,
		/**
		 * Builds the HTML elements of the html property into a node, also assigning events during the build, which is then inserted into the page by a Document Fragment.
		 */
		build_route_box()
		{
			html.containing_box.appendChild(html.route_title);
			html.containing_box.appendChild(html.pokemon_image_holder);
			html.containing_box.appendChild(html.pokemon_selection_wrapper);
			html.containing_box.appendChild(html.state_dropdown);

			assign_pokemon_input_field_events(html.pokemon_selection_wrapper.pokemon_input_field, html.pokemon_selection_wrapper.pokemon_list, route_box);
			assign_pokemon_list_events(html.pokemon_selection_wrapper.pokemon_list, html.pokemon_selection_wrapper.pokemon_input_field, html.pokemon_image_holder.pokemon_image, route_box);

			document.body.appendChild(html.containing_box);
		}
	}

	return route_box;
}

/**
 * Function that should contain all code to run when the script is invoked.
 */
function main()
{
	const new_run_button = document.getElementById("main-menu-new-run-button");

	new_run_button.addEventListener("click", new_run);
}

main()