// main.js

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
  
  function validateLoginForm(event) {
    const email = document.getElementById('email')
    const password = document.getElementById('password')
  
    if (!email.value || !password.value) {
      alert('Please fill out all fields.')
      event.preventDefault()
    }
  }
  
  function validateRegisterForm(event) {
    const name = document.getElementById('name')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
  
    if (!name.value || !email.value || !password.value) {
      alert('Please fill out all fields.')
      event.preventDefault()
    }
  }
  
  // Delete user function
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
  
  // Delete job function
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
  
  // Update job function
  async function getUpdateJobAuth() {
    const res = confirm('Are you sure you want to update this job application?')
    if (res) document.getElementById('updateJobForm').submit()
  }
  