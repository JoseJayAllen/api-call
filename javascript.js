document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "5e4afb9007msh95784f455c5e22fp16d957jsneaa4dd9fd20a";
    const apiURL = "https://background-removal.p.rapidapi.com/remove";
    const apiHost = "background-removal.p.rapidapi.com";

    let currentPage = 0;
    const itemsPerPage = 1;
    let processedImages = [];

    document.getElementById("processImage").addEventListener("click", async () => {
        const imageURL = document.getElementById("imageURL").value;
        const imageFile = document.getElementById("imageFile").files[0];

        if (!imageURL && !imageFile) {
            alert("Please enter an image.");
            return;
        }

    try {
        let response;
        const formData = new FormData();
        if (imageFile){
            formData.append("image_file", imageFile);
        } else if (imageURL) {
            formData.append("image_url", imageURL);
        }

        formData.append("output_format","url");

            response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "x-rapidapi-host": apiHost,
                    "x-rapidapi-key": apiKey
                },
                body: formData
            });

            await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    });

    async function handleResponse(response) {
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        console.log("Data received:", data);
        if (data.response && data.response.image_url) {
            processedImages.push(data.response.image_url);
            displayImages();
        } else {
            throw new Error("Error processing image.");
        }
    }

    function displayImages() {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "";

        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const imagesToDisplay = processedImages.slice(startIndex,endIndex);

        imagesToDisplay.forEach(url => {
            const imgElement = document.createElement("img");
            imgElement.src = url;
            imgElement.alt = "Processed Image";
            imgElement.className = "w-full rounded mt-2";
            resultDiv.appendChild(imgElement);
        });

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        document.getElementById("prevPage").disabled = currentPage === 0;
        document.getElementById("nextPage").disabled = (currentPage + 1) *
        itemsPerPage >= processedImages.length;
    }

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            displayImages();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if ((currentPage + 1) * itemsPerPage < processedImages.length) {
            currentPage++;
            displayImages();
        }
    });

    function handleError(error) {
        console.error("An error occured:", error);
        const errorDiv = document.getElementById("error");
        errorDiv.textContent = error.message;
    }
});