// Import functions from separate files
import { getDeleteUser, getDeleteJobAuth, getUpdateJobAuth } from './actions/confirmActions.js'
import { toggleSearchBar, searchJobs } from './actions/searchActions.js'
import { manageCategoryActions } from './actions/categoryActions.js'

document.addEventListener('DOMContentLoaded', () => {
  // Initialize search bar toggle
  toggleSearchBar()

  // Search functionality
  document.getElementById('jobSearchForm').addEventListener('submit', (e) => {
    e.preventDefault()
    searchJobs()
  })

  // Manage job categories and skills
  manageCategoryActions()
})
