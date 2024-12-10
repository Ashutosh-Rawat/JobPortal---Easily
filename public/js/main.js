// main.js
// load register and login form when clicked
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm')
  const registerForm = document.getElementById('registerForm')

  if (loginForm) {
    const submitButton = document.getElementById('loginSubmitBtn')
    if (submitButton) {
      submitButton.addEventListener('click', validateLoginForm)
    }
  }

  if (registerForm) {
    const submitButton = document.getElementById('registerSubmitBtn')
    if (submitButton) {
      submitButton.addEventListener('click', validateRegisterForm)
    }
  }
})

// login for validations
function validateLoginForm(event) {
  const email = document.getElementById('email')
  const password = document.getElementById('password')

  if (!email.value || !password.value) {
    alert('Please fill out all fields.')
    event.preventDefault()
  }
}
// registeration form validations
function validateRegisterForm(event) {
  const name = document.getElementById('name')
  const email = document.getElementById('email')
  const password = document.getElementById('password')

  if (!name.value || !email.value || !password.value) {
    alert('Please fill out all fields.')
    event.preventDefault()
  }
}
  
// Delete user function confimation
async function getDeleteUser() {
  const res = confirm('Are you sure, this will delete all your posted jobs and data?')
  if (res) {
    const request = await fetch(
      `/deleteUser`,
      { method: 'POST' }
    )
    if (request.ok) window.location.href = '/'
  }
}
  
// Delete job function confirmation
async function getDeleteJobAuth(jobid) {
  const res = confirm('Are you sure you want to delete this job application?')
  if (res) {
    const request = await fetch(
      `/jobs/${jobid}/delete`,
      { method: 'POST' }
    )
    if (request.ok) window.location.href = '/jobs'
  }
}
  
// Update job function confirmation
async function getUpdateJobAuth() {
  const res = confirm('Are you sure you want to update this job application?')
  if (res) document.getElementById('updateJobForm').submit()
}
  
// search bar 
document.addEventListener('DOMContentLoaded', () => {
  const jobSearchForm = document.getElementById('jobSearchForm')

  if (jobSearchForm) {
    const pathname = window.location.pathname
    if (pathname === '/jobs' || pathname.startsWith('/jobs')) {
      jobSearchForm.classList.remove('d-none')
    } else {
      jobSearchForm.classList.add('d-none')
    }
  }
})
  
function searchJobs() {
  const query = document.getElementById('jobSearch').value.trim().toLowerCase()
  if (!query) return

  window.location.href = `/jobs?search=${encodeURIComponent(query)}`
}
  