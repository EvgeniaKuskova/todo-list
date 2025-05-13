function createElement(tag, attributes, children, ) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      inputText : "",
      todo: [
        {id: 1, text: "Сделать домашку", completed: false},
        {id: 2, text: "Сделать практику", completed: false},
        {id: 3, text: "Пойти домой", completed: false}
      ],
      lastId : 3
    }
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }),
        createElement("button", { id: "add-btn" }, "+"),
      ]),
      createElement(
          "ul",
          { id: "todos" },
          this.state.todo.map((todo) =>
              createElement("li", { key: todo.id }, [
                createElement("input", {
                  type: "checkbox",
                  checked: todo.completed,
                }),
                createElement("label", {}, todo.text),
                createElement("button", {}, "🗑️"),
              ])
          )
      ),
    ]);
  };

  onAddTask() {
    if (this.state.inputText.trim()){
      this.state.todo.push({id: this.state.lastId + 1, text : this.state.inputText, completed : false});
      this.state.inputText = "";
      this.state.lastId += 1;
      
    }
  };

  onAddInputChange(event) {
    this.state.inputText = event.target.value;
  };
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
