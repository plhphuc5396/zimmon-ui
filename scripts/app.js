const vibeSection = document.getElementById('vibe-section');
const DUMMY_URL = 'https://dummy-backend-url.com/api/submit'; // Replace later

function renderTemplateStep() {
    vibeSection.innerHTML = `
        <div class="card p-4 mt-4">
            <h2 class="mb-3">Step 1: Select a template</h2>
            <select id="template-select" class="form-select mb-3">
                <option value="" disabled selected>Select a template</option>
                <option value="template-1">Template 1</option>
                <option value="template-2">Template 2</option>
                <option value="template-3">Template 3</option>
            </select>
            <div id="form-container"></div>
        </div>
    `;

    document.getElementById('template-select').addEventListener('change', renderFormStep);
}

function renderFormStep() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <form id="vibe-form" class="mt-4">
            <div class="mb-3">
                <label for="context" class="form-label">Context:</label>
                <textarea id="context" name="context" rows="3" maxlength="300" class="form-control" required></textarea>
            </div>
            <div class="mb-3">
                <label for="main-color" class="form-label">Main color:</label>
                <input type="text" id="main-color" name="mainColor" class="form-control" placeholder="#FF0000 or red" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Media type:</label>
                <div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="mediaType" id="media-video" value="video" required>
                        <label class="form-check-label" for="media-video">Video</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="mediaType" id="media-image" value="image" required>
                        <label class="form-check-label" for="media-image">Image</label>
                    </div>
                </div>
            </div>
            <div id="custom-fields" class="mb-3"></div>
            <button type="button" id="add-more-info" class="btn btn-outline-secondary btn-sm mb-3">+ More info</button>
            <br>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        <div id="form-status" class="mt-3"></div>
    `;

    let customFieldCount = 0;
    document.getElementById('add-more-info').addEventListener('click', function(e) {
        e.preventDefault();
        let label = prompt('Enter a label for this custom field:');
        if (!label) return; // Cancel if user presses Cancel or leaves blank
        customFieldCount++;
        const customFieldsDiv = document.getElementById('custom-fields');
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group mb-2';
        inputGroup.innerHTML = `
            <span class="input-group-text">${label}</span>
            <input type="text" name="custom-${customFieldCount}" placeholder="${label}" class="form-control custom-field" data-label="${label}">
        `;
        customFieldsDiv.appendChild(inputGroup);
    });

    document.getElementById('vibe-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            template: document.getElementById('template-select').value,
            context: form.context.value,
            mainColor: form.mainColor.value,
            mediaType: form.mediaType.value,
        };
        // Collect custom fields
        const customInputs = form.querySelectorAll('.custom-field');
        customInputs.forEach((input, idx) => {
            data[`custom-${idx+1}`] = input.value;
        });

        // Submit to dummy backend
        try {
            const res = await fetch(DUMMY_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            document.getElementById('form-status').innerHTML = res.ok
                ? '<div class="alert alert-success">Submitted!</div>'
                : '<div class="alert alert-danger">Submission failed.</div>';
        } catch {
            document.getElementById('form-status').innerHTML = '<div class="alert alert-danger">Submission failed.</div>';
        }
    });
}

document.getElementById('start-vibing-btn').className = 'btn btn-success btn-lg mt-4';
document.getElementById('start-vibing-btn').addEventListener('click', renderTemplateStep);