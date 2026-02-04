document.addEventListener("DOMContentLoaded", () => {

    const title = document.getElementById("title");
    const desc = document.getElementById("desc");
    const priority = document.getElementById("priority");
    const dateInput = document.getElementById("date");
    const addBtn = document.getElementById("add");
    const list = document.getElementById("list");
    const search = document.getElementById("search");

    const total = document.getElementById("total");
    const active = document.getElementById("active");
    const done = document.getElementById("done");

    const filterBtns = document.querySelectorAll(".filters button");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let filter = "all";

    /* ================= DATE SETUP ================= */

    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    dateInput.min = today;

    function formatDate(dateStr) {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    /* ================= STORAGE ================= */

    function save() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    /* ================= STATS ================= */

    function updateStats() {
        total.textContent = tasks.length;
        active.textContent = tasks.filter(t => !t.done).length;
        done.textContent = tasks.filter(t => t.done).length;
    }

    /* ================= RENDER ================= */

    function render() {
        list.innerHTML = "";

        tasks
            .filter(t => {
                if (filter === "active") return !t.done;
                if (filter === "done") return t.done;
                return true;
            })
            .filter(t =>
                t.title.toLowerCase().includes(search.value.toLowerCase())
            )
            .forEach(task => {
                const li = document.createElement("li");
                if (task.done) li.classList.add("done");

                li.innerHTML = `
                    <div>
                        <strong>${task.title}</strong><br>
                        <small>${task.desc || ""}</small><br>
                        <small>${formatDate(task.date)}</small>
                    </div>
                    <span class="badge ${task.priority}">
                        ${task.priority}
                    </span>
                `;

                li.onclick = () => {
                    task.done = !task.done;
                    save();
                    render();
                };

                list.appendChild(li);
            });

        updateStats();
    }

    /* ================= ADD TASK ================= */

    addBtn.onclick = () => {
        if (!title.value.trim()) return;

        tasks.push({
            title: title.value,
            desc: desc.value,
            priority: priority.value,
            date: dateInput.value,
            done: false
        });

        title.value = "";
        desc.value = "";
        dateInput.value = today;

        save();
        render();
    };

    /* ================= FILTER ================= */

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filter = btn.dataset.filter;
            render();
        };
    });

    search.oninput = render;

    render();

});
