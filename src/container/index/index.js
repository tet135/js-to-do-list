export class Todo {
  static #NAME = 'todo'

  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      //передаэмо в JSON форматі
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      //РОЗПАРСИЛИ дані (з JSON в JS)
      const { list, count } = JSON.parse(data)

      this.#list = list
      this.#count = count
    }
  }

  //містить посилання для обёэктів задач
  static #list = []
  static #count = 0

  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }

  //містить посилання на блок з задачами main, сюди будемо додавати нові задачі
  static #block = null
  //містить посиланнЯ на template
  static #template = null //#template містить #document-fragment!!!

  static #input = null
  static #button = null

  static init = () => {
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild

    this.#block = document.querySelector('.task__list')
    this.#input = document.querySelector('.form__input')
    this.#button = document.querySelector('.form__button')

    this.#button.onclick = this.#handleAdd

    this.#loadData()
    this.#render()

    // console.log(this.#list)

    // console.log(
    //   this.#template,
    //   this.#block,
    //   this.#input,
    //   this.#button,
    // )
  }

  //метод контролює створення сутності #createTaskData
  static #handleAdd = () => {
    const value = this.#input.value

    if (value.length > 1) {
      //передаєм в задачу введене в полі input значення
      this.#createTaskData(value)
      //очищуємо полу ввода, щоб вручну користувач не видаляв введений текст
      this.#input.value = ''
      this.#saveData()
      this.#render()
    }
  }

  static #render = () => {
    //очищує список задач, що не додавати по кілька разів одне і те саме
    this.#block.innerHTML = ''

    if (this.#list.length === 0) {
      this.#block.innerText = 'Немає поточних задач'
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElem(taskData)
        this.#block.append(el)
      })
    }
  }

  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true)
    const [id, text, btnDo, btnDelete] = el.children

    id.innerText = `${data.id}.`
    text.innerText = data.text
    btnDelete.onclick = this.#handleDelete(data)
    btnDo.onclick = this.#handleDo(data, btnDo, el)

    if (data.done) {
      el.classList.add('task--done')
      btnDo.classList.remove('task__button--do')
      btnDo.classList.add('task__button--done')
    }

    return el
  }

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id)

    //тобто виконуэться, коли result не null
    if (result === true || result === false) {
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')
    }

    this.#saveData()
  }

  static #toggleDone = (id) => {
    const task = this.#list.find((task) => task.id === id)
    if (task) {
      task.done = !task.done
      return task.done
    } else {
      return null
    }
  }

  //незвична функція, вона повертає іншу функцію (ось таку () => {} )
  static #handleDelete = (data) => () => {
    //модальне вікно з підтвердженням дії через confirm
    if (confirm('Видалити задачу?')) {
      const result = this.#deleteById(data.id)
      if (result) this.#render() //save?
    }

    this.#saveData()
  }

  static #deleteById = (id) => {
    this.#list = this.#list.filter((task) => task.id !== id)
    return true
  }

  static save = () => {
    localStorage.setItem('taskList', this.#list)
  }
}

Todo.init()

window.todo = Todo
