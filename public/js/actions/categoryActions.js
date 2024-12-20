import jobCategories from '../jobCategories.js'

export function manageCategoryActions() {
  const addJobCategory = document.querySelector('#addJobCategory')
  const addJobDesignation = document.querySelector('#addJobDesignation')
  const addSkillsContainer = document.querySelector('#addSkillsContainer')

  const updateJobCategory = document.querySelector('#updateJobCategory')
  const updateJobDesignation = document.querySelector('#updateJobDesignation')
  const updateSkillsContainer = document.querySelector('#updateSkillsContainer')

  const mapFields = [
    {
      jobCategorySelect: addJobCategory,
      jobDesignationSelect: addJobDesignation,
      skillsContainer: addSkillsContainer,
    },
    {
      jobCategorySelect: updateJobCategory,
      jobDesignationSelect: updateJobDesignation,
      skillsContainer: updateSkillsContainer,
    },
  ]

  mapFields.forEach(({ jobCategorySelect, jobDesignationSelect, skillsContainer }) => {
    // Populate job category dropdown
    jobCategorySelect.innerHTML = '<option value="">Select a Category</option>'
    jobCategories.forEach(category => {
      const option = document.createElement('option')
      option.value = category.jobCategory
      option.text = category.jobCategory
      jobCategorySelect.appendChild(option)
    })

    // Handle category change to update skills and designations
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
            <input class="form-check-input" type="checkbox" name="skills[]" value="${skill}" id="skill-${skill}">
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
