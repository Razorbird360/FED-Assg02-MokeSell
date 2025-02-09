document.addEventListener('DOMContentLoaded', function () {
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('image');
    const filePreviewContainer = document.getElementById('file-preview-container');

    // Open file dialog when clicking on the drag-and-drop area
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle drag events
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#008cfe';
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.borderColor = '#ccc';
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#ccc';

        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Handle file selection via input
    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        handleFiles(files);
    });

    // Function to handle file uploads and previews
    function handleFiles(files) {
        filePreviewContainer.innerHTML = ''; // Clear previous previews

        for (const file of files) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const previewDiv = document.createElement('div');
                previewDiv.classList.add('file-preview');

                const img = document.createElement('img');
                img.src = e.target.result;

                const fileName = document.createElement('span');
                fileName.textContent = file.name;

                previewDiv.appendChild(img);
                previewDiv.appendChild(fileName);
                filePreviewContainer.appendChild(previewDiv);
            };

            reader.readAsDataURL(file);
        }
    }
});