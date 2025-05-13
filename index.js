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
    this._domNode = null;
  }

  getDomNode() {
    if (!this._domNode) {
      this._domNode = this.render();
    }
    return this._domNode;
  }

  update() {
    const oldNode = this._domNode;
    const newNode = this.render();
    oldNode.parentNode.replaceChild(newNode, oldNode);
    this._domNode = newNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      inputText: "",
      todo: [
        {id: 1, text: "Сделать домашку", completed: false},
        {id: 2, text: "Сделать практику", completed: false},
        {id: 3, text: "Пойти домой", completed: false}
      ],
      lastId: 3
    };
    
    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
    this.onToggleComplete = this.onToggleComplete.bind(this);
    this.onDeleteTask = this.onDeleteTask.bind(this);
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
          }),
          createElement("button", { id: "add-btn" }, "+"),
        ],
        {
          input: (e) => this.onAddInputChange(e),
          click: (e) => e.target.id === "add-btn" && this.onAddTask(),
        }
      ),
      createElement(
        "ul",
        { id: "todos" },
        this.state.todo.map((todo) => {
          const  attributes = {
                type: "checkbox",
                "data-id": todo.id,
              };
              if (todo.completed)
                attributes.checked = true;
          return createElement(
            "li", 
            { 
              key: todo.id,
              style: `color: ${todo.completed ? "gray" : "black"}; text-decoration: ${todo.completed ? "line-through" : "none"}`
            }, 
            [
              createElement("input", attributes),
              createElement("label", {}, todo.text),
              createElement("button", { "data-id": todo.id }, "🗑️"),
            ],
            {
              change: (e) => e.target.type === "checkbox" && this.onToggleComplete(todo.id),
              click: (e) => e.target.textContent === "🗑️" && this.onDeleteTask(todo.id),
            }
          )
        }
        )
      ),
    ]);
  }

  onAddTask() {
    if (this.state.inputText.trim()) {
      this.state.todo.push({
        id: this.state.lastId + 1,
        text: this.state.inputText,
        completed: false
      });
      this.state.inputText = "";
      this.state.lastId += 1;
      this.update();
    }
  }

  onAddInputChange(event) {
    this.state.inputText = event.target.value;
  }

  onToggleComplete(id) {
    const todo = this.state.todo.find(item => item.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.update();
    }
  }

  onDeleteTask(id) {
    this.state.todo = this.state.todo.filter(item => item.id !== id);
    this.update();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});