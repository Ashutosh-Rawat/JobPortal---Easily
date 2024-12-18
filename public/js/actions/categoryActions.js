import jobCategories from '../jobCategories.js'

export function manageCategoryActions() {
  const jobCategorySelects = document.querySelectorAll('#jobCategory') // Handles both add and update modals
  const jobDesignationSelects = document.querySelectorAll('#jobDesignation')
  const skillsContainers = document.querySelectorAll('#skillsContainer')

  // Populate job category dropdown
  jobCategorySelects.forEach(select => {
    select.innerHTML = '<option value="">Select a Category</option>'
    jobCategories.forEach(category => {
      const option = document.createElement('option')
      option.value = category.jobCategory
      option.text = category.jobCategory
      select.appendChild(option)
    })
  })

  // Handle category change to update skills and designations
  jobCategorySelects.forEach((jobCategorySelect, index) => {
    const jobDesignationSelect = jobDesignationSelects[index]
    const skillsContainer = skillsContainers[index]

    jobCategorySelect.addEventListener('change', () => {
      const selectedCategory = jobCategories.find(
        category => category.jobCategory === jobCategorySelect.value
      )

      // Update Designation Dropdown
      jobDesignationSelect.innerHTML = '<option value="">Select a Designation</option>'
      if (selectedCategory) {
        selectedCategory.jobNames.forEach(designation => {
          const option = document.createElement('option')
          option.value = designation
          option.text = designation
          jobDesignationSelect.appendChild(option)
        })
      }

      // Update Skills Checkboxes
      skillsContainer.innerHTML = ''
      if (selectedCategory) {
        selectedCategory.skillsNeeded.forEach(skill => {
          const div = document.createElement('div')
          div.classList.add('form-check', 'me-3')
          div.innerHTML = `
            <input class="form-check-input" type="checkbox" name="skills" value="${skill}" id="skill-${skill}">
            <label class="form-check-label" for="skill-${skill}">${skill}</label>
          `
          skillsContainer.appendChild(div)
        })
      }
    })

    // Trigger change event initially to populate fields if preselected
    jobCategorySelect.dispatchEvent(new Event('change'))
  })
}
