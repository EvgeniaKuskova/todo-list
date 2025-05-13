function createElement(tag, attributes, children, eventListeners = {}) {
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

  if (eventListeners) {
    Object.keys(eventListeners).forEach((eventType) => {
      element.addEventListener(eventType, eventListeners[eventType]);
    });
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

  update() {
    const newTodo = this.render();
    document.body.appendChild(newTodo)
    this._domNode = newTodo;
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
      createElement(
          "div",
          { class: "add-todo" },
          [
            createElement("input", {
              id: "new-todo",
              type: "text",
              placeholder: "Задание",
              value: this.state.inputText,
            }, null, {
              change: this.onAddInputChange.bind(this),
            }),
            createElement("button", { id: "add-btn" }, "+", {click: this.onAddTask.bind(this)}),
          ],
      ),
      createElement(
          "ul",
          { id: "todos" },
          this.state.todo.map((todo) =>
              createElement("li", { key: todo.id }, [
                createElement("input", {
                  type: "checkbox",
                  checked: todo.completed,
                }, null, ),
                createElement("label", {}, todo.text),
                createElement("button", {}, "🗑️", ),
              ])
          )
      ),
    ]);
  }

  onAddTask() {
    if (this.state.inputText.trim()){
      this.state.todo.push({id: this.state.lastId + 1, text : this.state.inputText, completed : false});
      this.state.inputText = "";
      this.state.lastId += 1;
      this.update();
    }
  };

  onAddInputChange(event) {
    this.state.inputText = event.target.value;
    this.update();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
