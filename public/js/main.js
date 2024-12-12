// Import functions from separate files
import { getDeleteUser, getDeleteJobAuth, getUpdateJobAuth } from './actions/confirmActions.js'
import { toggleSearchBar, searchJobs } from './actions/searchActions.js'
import { manageCategoryActions } from './actions/categoryActions.js'

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

document.addEventListener('DOMContentLoaded', () => {
  // Initialize search bar toggle
  toggleSearchBar()

  // Search functionality
  const jobSearchForm = document.getElementById('jobSearchForm')
  if (jobSearchForm) {
    jobSearchForm.addEventListener('submit', e => {
      e.preventDefault()
      searchJobs()
    })
  }

  // Manage job categories and skills
  manageCategoryActions()
})
