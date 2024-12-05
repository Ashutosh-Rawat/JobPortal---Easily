import jobCategories from "./jobCategories.js"
document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm')
    const jobCategorySelect = document.getElementById('jobCategory')
    const skillsSelect = document.getElementById('skills')
    const salaryRange = document.getElementById('salary')
    const salaryRangeValue = document.getElementById('salaryRangeValue')
    const jobTilesContainer = document.getElementById('jobTiles')
    const choices = new Choices(skillsSelect, {
      removeItemButton: true,
      searchEnabled: true,
      placeholder: true,
      placeholderValue: 'Select skills'
    })
  
    // Initialize salary range display
    salaryRangeValue.textContent = `0 - 100`
  
    salaryRange.addEventListener('input', () => {
      const value = salaryRange.value
      salaryRangeValue.textContent = `0 - ${value}`
    })
  
    jobCategorySelect.addEventListener('change', () => {
      const selectedCategory = jobCategorySelect.value
      const selectedCategoryObject = jobCategories.find(cat => cat.jobCategory === selectedCategory)
      updateSkillsOptions(selectedCategoryObject)
    })
  
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault()
      filterJobs()
    })
  
    function updateSkillsOptions(category) {
      choices.clearStore()
      choices.clearChoices()
  
      if (category) {
        category.skillsNeeded.forEach(skill => {
          choices.setChoices([{ value: skill, label: skill }], 'value', 'label', false)
        })
      }
    }
  
    function filterJobs() {
        const selectedCategory = jobCategorySelect.value;
        const selectedSkills = Array.from(skillsSelect.selectedOptions).map(option => option.value);
        const selectedSalary = salaryRange.value;
      
        const filteredJobs = data.filter(job => {
          const matchesCategory = selectedCategory ? job.jobCategory === selectedCategory : true;
          const matchesSkills = selectedSkills.length ? selectedSkills.every(skill => job.skillsRequired.includes(skill)) : true;
          const matchesSalary = job.salary <= selectedSalary;
      
          return matchesCategory && matchesSkills && matchesSalary;
        });
      
        displayJobs(filteredJobs);
      }
        
    function displayJobs(jobs) {
      jobTilesContainer.innerHTML = ''
      if (jobs.length === 0) {
        jobTilesContainer.innerHTML = '<p>No jobs match your criteria.</p>'
        return
      }
      jobs.forEach(job => {
        const jobTile = document.createElement('div')
        jobTile.classList.add('job-tile', 'd-flex', 'flex-column', 'p-3')
  
        jobTile.innerHTML = `
          <div class="job-content flex-grow-1">
            <h3 class="text-primary">${job.jobDesign}</h3>
            <p class="text-muted">Company: ${job.companyName}</p>
            <p class="text-muted">Location: ${job.jobLocation}</p>
            <p class="text-muted">Package: ₹${job.salary} LPA</p>
            <p class="text-muted">Apply By: ${job.applyBy}</p>
            <p class="text-muted mt-3">Skills Required:</p>
            <div class="skills-container">
              ${job.skillsRequired.map(skill => `<span class="skill-pill">${skill}</span>`).join('')}
            </div>
          </div>
          <a href="/jobs/${job.jobId}" class="btn btn-outline-secondary mt-3 align-self-start">Details</a>
        `
        jobTilesContainer.appendChild(jobTile)
      })
    }
  })
  