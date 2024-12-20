import { manageCategoryActions } from "./categoryActions.js"

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof job !== 'undefined') {
        const updateJobCategory = document.querySelector('#updateJobCategory')
        const updateJobDesignation = document.querySelector('#updateJobDesignation')
        const updateSkillsContainer = document.querySelector('#updateSkillsContainer')
        const updateLocation = document.querySelector('#updateLocation')
        const updateCompanyName = document.querySelector('#updateCompanyName')
        const updateSalary = document.querySelector('#updateSalary')
        const updateApplyBy = document.querySelector('#updateApplyBy')
        const updateOpenings = document.querySelector('#updateOpenings')

        function populateUpdateFields(jobData) {
            if (updateJobCategory) {
                const categoryOption = Array.from(updateJobCategory.options).find(
                    option => option.value === jobData.category
                )
                if (categoryOption) categoryOption.selected = true
                updateJobCategory.dispatchEvent(new Event('change'))
            }

            setTimeout(() => {
                if (updateJobDesignation) {
                    const designationOption = Array.from(updateJobDesignation.options).find(
                        option => option.value === jobData.designation
                    )
                    if (designationOption) designationOption.selected = true
                }

                if (updateSkillsContainer && jobData.skills) {
                    const skillCheckboxes = updateSkillsContainer.querySelectorAll('input[type="checkbox"]')
                    skillCheckboxes.forEach(checkbox => {
                        if (jobData.skills.includes(checkbox.value)) {
                            checkbox.checked = true
                            checkbox.closest('div').classList.add('selected-skill')
                        }
                    })
                }

                if (updateLocation) updateLocation.value = jobData.location || ''
                if (updateCompanyName) updateCompanyName.value = jobData.companyName || ''
                if (updateSalary) updateSalary.value = jobData.salary || ''
                if (updateApplyBy) updateApplyBy.value = jobData.applyBy ? new Date(jobData.applyBy).toISOString().split('T')[0] : ''
                if (updateOpenings) updateOpenings.value = jobData.openings || 1
            }, 100)
        }

        const jobData = JSON.parse(job)
        // console.log(jobData)
        const updateJobModal = document.getElementById('updateJobModal')

        if (updateJobModal) {
            updateJobModal.addEventListener('show.bs.modal', async () => {
                await manageCategoryActions()
                populateUpdateFields(jobData)
            })
        }
    }
})
