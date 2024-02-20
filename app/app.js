class Autocomplete {
  constructor(id, url) {
    this.id = id;
    this.url = url;
    this.inputElement = document.getElementById(id);
    this.dropdown = null;
    this.init();
  }

  init() {
    this.inputElement.addEventListener('input', this.handleInput.bind(this));
  }

  async fetchData() {
    try {
      const response = await fetch(this.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  async handleInput(event) {
    const inputValue = event.target.value.trim();

    if (!inputValue) {
      this.removeDropdown();
      return;
    }

    const filteredData = (await this.fetchData()).filter((obj) =>
      obj.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    this.displayDropdown(filteredData);
  }

  displayDropdown(data) {
    this.removeDropdown();

    this.dropdown = document.createElement('ul');
    this.dropdown.classList.add('autocomplete-dropdown');

    data.forEach((item) => {
      const name = item.name;
      const listItem = document.createElement('li');

      listItem.textContent = name;
      this.dropdown.appendChild(listItem);

      listItem.addEventListener('click', () => this.handleItemSelection(item));
    });

    document.body.appendChild(this.dropdown);
  }

  removeDropdown() {
    if (this.dropdown) {
      this.dropdown.remove();

      this.dropdown = null;
    }
  }

  handleItemSelection(item) {
    this.inputElement.value = item.name;
    this.removeDropdown();
  }

  clearInput() {
    this.inputElement.value = '';
    this.removeDropdown();
  }
}

const autocomplete = new Autocomplete(
  'autocomplete-input',
  'https://jsonplaceholder.typicode.com/users',
);

const clearButton = document.getElementById('autocomplete-btn');

clearButton.addEventListener('click', () => autocomplete.clearInput());
