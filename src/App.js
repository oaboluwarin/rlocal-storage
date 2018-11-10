
import React, { Component } from "react";
import "./App.css";

class App extends Component {

  state = {
    newItem: "",
    list: []
  };

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();

      // add event listener to save state to localStorage
      // when user leaves/refreshes the page
      window.addEventListener(
        "beforeunload",
        this.saveStateToLocalStorage.bind(this)
      );
  }

  componentWillUnmount() {
      window.removeEventListener(
        "beforeunload",
        this.saveStateToLocalStorage.bind(this)
      );

      // saves if component has a chance to unmount
      this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  updateInput = ({ target: { name, value } }) => {
    // update react state
    this.setState(() => ({ [name]: value }));
  }

  addItem = () => {
    // create a new item
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice()
    };

    // copy current list of items
    const list = [...this.state.list];

    // add the new item to the list
    const updatedList = list.concat([newItem]);

    // update state with new list, reset the new item input
    this.setState(() => ({
      list: updatedList,
      newItem: ""
    }));
  }

  deleteItem = () => (id) => {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState(() => ({ list: updatedList }));
  }

  render() {
    const {
      state: { newItem, list },
      addItem,
      deleteItem,
      updateInput
    } = this;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React LocalStorage Tutorial</h1>
        </header>
        <div
          style={{
            padding: 50,
            textAlign: "left",
            maxWidth: 500,
            margin: "auto"
          }}
        >
          Add an item to the list
          <br />
          <input
            type="text"
            placeholder="Type item here"
            name="newItem"
            value={newItem}
            onChange={updateInput}
          />
          <button
            onClick={addItem}
            disabled={!newItem.length}
          >
            &#43; Add
          </button>
          <br /> <br />
          <ul>
            {list.map(item => {
              return (
                <li key={item.id}>
                  {item.value}
                  <button onClick={deleteItem(item.id)}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
