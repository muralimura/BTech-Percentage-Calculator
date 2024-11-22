document.addEventListener("DOMContentLoaded", () => {
    const semSelector = document.getElementById("sem-selector");
    const semestersContainer = document.getElementById("semesters-container");
    const calculateFinalBtn = document.getElementById("calculate-final");
    const finalResultDiv = document.getElementById("final-result");
    const semesterPercentages = {};

    semSelector.addEventListener("change", () => {
        const selectedSem = semSelector.value;
        if (!selectedSem) return;

        // Check if semester already exists
        if (document.getElementById(`semester-${selectedSem}`)) return;

        // Create semester input block
        const semDiv = document.createElement("div");
        semDiv.id = `semester-${selectedSem}`;
        semDiv.classList.add("semester");

        semDiv.innerHTML = `
            <h2>Semester ${selectedSem}</h2>
            ${Array.from({ length: 10 }).map((_, idx) => `
                <label>Subject ${idx + 1} Marks: 
                    <input type="number" class="marks-input" min="0" max="100" />
                </label>
            `).join("<br>")}
            <button class="calculate-sem" data-sem="${selectedSem}">Calculate Semester ${selectedSem} Percentage</button>
            <div class="result" id="result-sem-${selectedSem}"></div>
        `;

        semestersContainer.appendChild(semDiv);

        calculateFinalBtn.style.display = "block";
    });

    semestersContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("calculate-sem")) {
            const sem = event.target.getAttribute("data-sem");
            const marksInputs = document.querySelectorAll(`#semester-${sem} .marks-input`);
            const marks = Array.from(marksInputs).map(input => Number(input.value) || 0);

            fetch("/calculate-sem-percentage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ marks }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.percentage !== undefined) {
                    semesterPercentages[sem] = data.percentage;
                    document.getElementById(`result-sem-${sem}`).innerText = `Percentage: ${data.percentage}%`;
                }
            });
        }
    });

    calculateFinalBtn.addEventListener("click", () => {
        const percentages = Object.values(semesterPercentages);

        fetch("/calculate-final-percentage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ percentages }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.final_percentage !== undefined) {
                finalResultDiv.innerText = `Final Percentage: ${data.final_percentage}%`;
            }
        });
    });
});
