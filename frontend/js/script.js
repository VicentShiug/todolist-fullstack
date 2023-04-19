const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.add-form')
const inputTask = document.querySelector('.input-task')

const fetchTasks = async () => {
  const response = await fetch('http://localhost:3333/tasks')
  const tasks = await response.json()
  return (tasks)
}

const addTask = async (event) => {
  event.preventDefault()

  const task = {
    title: inputTask.value
  }
  await fetch('http://localhost:3333/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })


  loadTasks()
  inputTask.value = ''

}

const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'delete'
  })
  loadTasks()
}

const updateTask = async (task) => {
  const { title, status, created_at, id } = task

  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, status })
  })

  console.log(status)
  loadTasks()
}

const formateDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle: 'short' }
  const date = new Date(dateUTC).toLocaleString('pt-br', options)
  return date
}

const createElement = (tag, innerText = '', innerHTML = '') => {
  const elemento = document.createElement(tag)
  if (innerText) {
    elemento.innerText = innerText
  }
  if (innerHTML) {
    elemento.innerHTML = innerHTML
  }
  return elemento
}

const createSelect = (value) => {
  const options = `
  <option value="pendente">pendente</option>
  <option value="em andamento">em andamento</option>
  <option value="concluida">concluida</option> 
  `
  const select = createElement('select', '', options)

  select.value = value
  return select
}

const createRow = (task) => {
  const { title, status, created_at, id } = task

  const tr = createElement('tr')
  const tdTitle = createElement('td', title)
  const tdCreatedAt = createElement('td', formateDate(created_at))


  const tdStatus = createElement('td')
  const tdActions = createElement('td')

  const select = createSelect(status)

  select.addEventListener('change', ({ target }) => updateTask({ ...task, status: target.value }))

  const editButton = createElement('button', '', '<span class="material-symbols-outlined"> edit </span>')
  const deleteButton = createElement('button', '', '<span class="material-symbols-outlined"> delete </span>')

  const editForm = createElement('form')
  const editInput = createElement('input')

  editInput.value = title
  editForm.appendChild(editInput)
  if (status == 'concluida') {
    tr.style.backgroundColor = 'rgba(000, 100, 19, 0.5)'
  }
  if (status == 'pendente') {
    tr.style.backgroundColor = 'rgba(255, 140, 0, 0.5)'
  }
  if (status == 'em andamento') {
    tr.style.backgroundColor = 'rgba(000, 100, 200, 0.5)'
  }

  editForm.addEventListener('submit', (event) => {
    event.preventDefault()
    updateTask({ ...task, title: editInput.value })
  })

  editButton.addEventListener('click', () => {
    tdTitle.innerText = ''
    tdTitle.appendChild(editForm)
  })

  editButton.classList.add('btn-action')
  deleteButton.classList.add('btn-action')

  deleteButton.addEventListener('click', () => { deleteTask(id) })

  tdStatus.appendChild(select)

  tdActions.appendChild(editButton)
  tdActions.appendChild(deleteButton)

  tr.appendChild(tdTitle)
  tr.appendChild(tdCreatedAt)
  tr.appendChild(tdStatus)
  tr.appendChild(tdActions)

  return tr
}

const loadTasks = async () => {
  const tasks = await fetchTasks()

  tbody.innerHTML = ''

  tasks.forEach((task) => {
    const tr = createRow(task)
    tbody.appendChild(tr)
  });
}

addForm.addEventListener('submit', addTask)

loadTasks()