/* =========================================================
   Cloudibell Tech — Careers page logic
   Vanilla JS, no external libraries.
   ========================================================= */
(function () {
    "use strict";

    /* -----------------------------------------------------
       Job data
       ----------------------------------------------------- */
    var JOBS = [
        {
            id: "java-fullstack",
            title: "Java Full Stack Developer",
            location: "Hyderabad",
            employmentType: "Full Time",
            experienceLabel: "Fresher / 1 Year",
            experienceBucket: "Fresher",
            department: "Engineering",
            salary: "\u20B94-6 LPA",
            posted: "Posted 3 days ago",
            description: "Build and maintain web applications end to end, from Java services to the HTML/CSS/JS front end that ships to clients.",
            skills: ["Java", "Spring Boot", "JDBC", "Hibernate", "MySQL", "HTML", "CSS", "JavaScript", "Git"]
        },
        {
            id: "salesforce-developer",
            title: "Salesforce Developer",
            location: "Hyderabad",
            employmentType: "Full Time",
            experienceLabel: "0-2 Years",
            experienceBucket: "0-2",
            department: "Salesforce",
            salary: "\u20B95-8 LPA",
            posted: "Posted 5 days ago",
            description: "Design and build Apex, Flows and Lightning Web Components for client orgs across Sales, Service and Experience Cloud.",
            skills: ["Apex", "SOQL", "Lightning", "Flows", "LWC"]
        },
        {
            id: "frontend-developer",
            title: "Frontend Developer",
            location: "Remote",
            employmentType: "Full Time",
            experienceLabel: "Fresher",
            experienceBucket: "Fresher",
            department: "Engineering",
            salary: "\u20B93-5 LPA",
            posted: "Posted 1 week ago",
            description: "Turn designs into responsive, accessible interfaces for our client-facing and internal Salesforce tooling projects.",
            skills: ["HTML", "CSS", "JavaScript", "React", "Bootstrap"]
        },
        {
            id: "qa-engineer",
            title: "QA Engineer",
            location: "Hyderabad",
            employmentType: "Full Time",
            experienceLabel: "1-3 Years",
            experienceBucket: "1-3",
            department: "Quality Assurance",
            salary: "\u20B94-6 LPA",
            posted: "Posted 2 days ago",
            description: "Own manual and automated test coverage across implementations, catching regressions before clients ever see them.",
            skills: ["Manual Testing", "Automation", "Java", "Selenium"]
        },
        {
            id: "business-analyst",
            title: "Business Analyst",
            location: "Hyderabad",
            employmentType: "Full Time",
            experienceLabel: "1-3 Years",
            experienceBucket: "1-3",
            department: "Business Analysis",
            salary: "\u20B95-7 LPA",
            posted: "Posted 6 days ago",
            description: "Translate client processes into Salesforce requirements, working directly with architects and delivery leads.",
            skills: ["Requirements Gathering", "Process Mapping", "Stakeholder Management"]
        },
        {
            id: "hr-recruiter",
            title: "HR Recruiter",
            location: "Hyderabad",
            employmentType: "Full Time",
            experienceLabel: "Fresher",
            experienceBucket: "Fresher",
            department: "People & Culture",
            salary: "\u20B93-4 LPA",
            posted: "Posted 4 days ago",
            description: "Run full-cycle hiring for our technical roles, from sourcing through offer, keeping candidates informed at every step.",
            skills: ["Sourcing", "Screening", "Coordination"]
        },
        {
            id: "salesforce-admin",
            title: "Salesforce Administrator",
            location: "Remote",
            employmentType: "Full Time",
            experienceLabel: "0-2 Years",
            experienceBucket: "0-2",
            department: "Salesforce",
            salary: "\u20B94-6 LPA",
            posted: "Posted 1 day ago",
            description: "Configure and maintain client orgs — users, security, automation and reporting — keeping day-to-day operations smooth.",
            skills: ["Salesforce Admin", "Flows", "Reports & Dashboards", "Data Management"]
        }
    ];

    var jobsGrid = document.getElementById("jobsGrid");
    var jobCardTemplate = document.getElementById("jobCardTemplate");
    var resultsCount = document.getElementById("resultsCount");
    var noResults = document.getElementById("noResults");
    var statOpenRoles = document.getElementById("statOpenRoles");

    if (statOpenRoles) statOpenRoles.textContent = String(JOBS.length);

    function renderJobs(list) {
        jobsGrid.innerHTML = "";
        if (!list.length) {
            noResults.hidden = false;
            resultsCount.textContent = "0 roles found";
            return;
        }
        noResults.hidden = true;
        resultsCount.textContent = list.length + (list.length === 1 ? " role found" : " roles found");

        list.forEach(function (job) {
            var node = jobCardTemplate.content.cloneNode(true);
            var card = node.querySelector(".cr-job-card");
            card.dataset.jobId = job.id;
            node.querySelector(".cr-job-title").textContent = job.title;
            node.querySelector(".cr-job-type").textContent = job.employmentType;
            node.querySelector(".cr-job-location").textContent = job.location;
            node.querySelector(".cr-job-experience").textContent = job.experienceLabel;
            node.querySelector(".cr-job-department").textContent = job.department;
            node.querySelector(".cr-job-salary").textContent = job.salary;
            node.querySelector(".cr-job-desc").textContent = job.description;
            node.querySelector(".cr-job-posted").textContent = job.posted;

            var skillsWrap = node.querySelector(".cr-job-skills");
            job.skills.forEach(function (skill) {
                var span = document.createElement("span");
                span.textContent = skill;
                skillsWrap.appendChild(span);
            });

            node.querySelector(".cr-job-apply").addEventListener("click", function () {
                openModal(job.title);
            });

            jobsGrid.appendChild(node);
        });

        observeReveals();
    }

    /* -----------------------------------------------------
       Filtering
       ----------------------------------------------------- */
    var filterForm = document.getElementById("filterForm");
    var filterKeyword = document.getElementById("filterKeyword");
    var filterDepartment = document.getElementById("filterDepartment");
    var filterExperience = document.getElementById("filterExperience");
    var filterLocation = document.getElementById("filterLocation");
    var filterType = document.getElementById("filterType");
    var resetFiltersBtn = document.getElementById("resetFilters");

    function applyFilters() {
        var keyword = filterKeyword.value.trim().toLowerCase();
        var department = filterDepartment.value;
        var experience = filterExperience.value;
        var location = filterLocation.value;
        var type = filterType.value;

        var filtered = JOBS.filter(function (job) {
            var matchesKeyword = !keyword ||
                job.title.toLowerCase().indexOf(keyword) !== -1 ||
                job.skills.join(" ").toLowerCase().indexOf(keyword) !== -1;
            var matchesDepartment = !department || job.department === department;
            var matchesExperience = !experience || job.experienceBucket === experience;
            var matchesLocation = !location || job.location === location;
            var matchesType = !type || job.employmentType === type;
            return matchesKeyword && matchesDepartment && matchesExperience && matchesLocation && matchesType;
        });

        renderJobs(filtered);
    }

    filterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        applyFilters();
    });

    [filterKeyword, filterDepartment, filterExperience, filterLocation, filterType].forEach(function (field) {
        field.addEventListener("input", applyFilters);
        field.addEventListener("change", applyFilters);
    });

    resetFiltersBtn.addEventListener("click", function () {
        filterForm.reset();
        applyFilters();
    });

    renderJobs(JOBS);

    /* -----------------------------------------------------
       Scroll reveal (IntersectionObserver)
       ----------------------------------------------------- */
    var revealObserver = null;

    function observeReveals() {
        if (!("IntersectionObserver" in window)) {
            document.querySelectorAll("[data-reveal]").forEach(function (el) {
                el.classList.add("is-visible");
            });
            return;
        }
        if (!revealObserver) {
            revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
        }
        document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    observeReveals();

    /* -----------------------------------------------------
       FAQ accordion
       ----------------------------------------------------- */
    document.querySelectorAll(".cr-accordion-trigger").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
            var expanded = trigger.getAttribute("aria-expanded") === "true";
            var panel = document.getElementById(trigger.getAttribute("aria-controls"));
            trigger.setAttribute("aria-expanded", String(!expanded));
            panel.hidden = expanded;
        });
    });

    /* -----------------------------------------------------
       Application modal
       ----------------------------------------------------- */
    var modalOverlay = document.getElementById("modalOverlay");
    var modalFormView = document.getElementById("modalFormView");
    var modalLoadingView = document.getElementById("modalLoadingView");
    var modalSuccessView = document.getElementById("modalSuccessView");
    var modalJobTitle = document.getElementById("modalJobTitle");
    var appliedJobTitle = document.getElementById("appliedJobTitle");
    var modalCloseBtn = document.getElementById("modalCloseBtn");
    var applicationForm = document.getElementById("applicationForm");
    var applicationId = document.getElementById("applicationId");
    var returnCareersBtn = document.getElementById("returnCareersBtn");
    var closeSuccessBtn = document.getElementById("closeSuccessBtn");

    var lastFocusedElement = null;

    function showView(view) {
        modalFormView.hidden = view !== "form";
        modalLoadingView.hidden = view !== "loading";
        modalSuccessView.hidden = view !== "success";
    }

    function openModal(jobTitle) {
        var title = jobTitle || "General Application";
        modalJobTitle.textContent = title;
        appliedJobTitle.value = title;
        showView("form");
        lastFocusedElement = document.activeElement;
        modalOverlay.hidden = false;
        document.body.style.overflow = "hidden";
        var firstField = document.getElementById("fullName");
        if (firstField) firstField.focus();
        document.addEventListener("keydown", trapFocus);
    }

    function closeModal() {
        modalOverlay.hidden = true;
        document.body.style.overflow = "";
        document.removeEventListener("keydown", trapFocus);
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    function trapFocus(e) {
        if (e.key === "Escape") {
            closeModal();
            return;
        }
        if (e.key !== "Tab") return;

        var focusable = modalOverlay.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        var visibleFocusable = Array.prototype.filter.call(focusable, function (el) {
            return el.offsetParent !== null;
        });
        if (!visibleFocusable.length) return;

        var first = visibleFocusable[0];
        var last = visibleFocusable[visibleFocusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    document.getElementById("heroApplyBtn").addEventListener("click", function () {
        openModal("General Application");
    });
    document.getElementById("generalApplyBtn").addEventListener("click", function () {
        openModal("General Application");
    });
    modalCloseBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) closeModal();
    });
    returnCareersBtn.addEventListener("click", closeModal);
    closeSuccessBtn.addEventListener("click", closeModal);

    /* -----------------------------------------------------
       Fresher / Experienced toggle
       ----------------------------------------------------- */
    var experienceTypeField = document.getElementById("experienceType");
    var expFields = document.querySelectorAll(".cr-form-field--exp");
    var expInputs = [
        "currentCompany", "previousCompany", "yearsExperience",
        "currentCtc", "expectedCtc", "noticePeriod", "experienceDescription"
    ].map(function (id) { return document.getElementById(id); });

    function applyExperienceMode() {
        var isFresher = experienceTypeField.value === "Fresher";
        expFields.forEach(function (field) {
            field.classList.toggle("is-disabled", isFresher);
        });
        expInputs.forEach(function (input) {
            input.disabled = isFresher;
            if (isFresher) {
                input.removeAttribute("required");
                input.value = "";
            } else {
                if (input.id !== "experienceDescription") {
                    input.setAttribute("required", "required");
                }
            }
        });
    }

    experienceTypeField.addEventListener("change", applyExperienceMode);
    applyExperienceMode();

    /* -----------------------------------------------------
       Form validation
       ----------------------------------------------------- */
    function setFieldError(fieldId, message) {
        var errorEl = document.querySelector('[data-error-for="' + fieldId + '"]');
        var field = document.getElementById(fieldId);
        if (errorEl) errorEl.textContent = message || "";
        if (field && field.closest(".cr-form-field")) {
            field.closest(".cr-form-field").classList.toggle("has-error", Boolean(message));
        }
    }

    function clearAllErrors() {
        document.querySelectorAll(".cr-form-error").forEach(function (el) { el.textContent = ""; });
        document.querySelectorAll(".cr-form-field.has-error").forEach(function (el) {
            el.classList.remove("has-error");
        });
    }

    function validateForm() {
        clearAllErrors();
        var isValid = true;

        var fullName = document.getElementById("fullName");
        if (!fullName.value.trim()) {
            setFieldError("fullName", "Full name is required.");
            isValid = false;
        }

        var email = document.getElementById("email");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
            setFieldError("email", "Enter a valid email address.");
            isValid = false;
        }

        var phone = document.getElementById("phone");
        var phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone.value.trim())) {
            setFieldError("phone", "Enter a valid 10-digit phone number.");
            isValid = false;
        }

        var qualification = document.getElementById("qualification");
        if (!qualification.value.trim()) {
            setFieldError("qualification", "Highest qualification is required.");
            isValid = false;
        }

        var experienceType = document.getElementById("experienceType");
        if (!experienceType.value) {
            setFieldError("experienceType", "Select an experience type.");
            isValid = false;
        }

        var resume = document.getElementById("resume");
        var file = resume.files && resume.files[0];
        if (!file) {
            setFieldError("resume", "Resume is required.");
            isValid = false;
        } else {
            var allowedExtensions = /\.(pdf|docx?|)$/i;
            var nameOk = /\.(pdf|doc|docx)$/i.test(file.name);
            var sizeOk = file.size <= 5 * 1024 * 1024;
            if (!nameOk) {
                setFieldError("resume", "Only PDF or DOCX files are accepted.");
                isValid = false;
            } else if (!sizeOk) {
                setFieldError("resume", "File must be 5 MB or smaller.");
                isValid = false;
            }
        }

        return isValid;
    }

    function generateApplicationId() {
        var randomPart = Math.floor(100000 + Math.random() * 900000);
        return "CBT-2026-" + randomPart;
    }

    applicationForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        showView("loading");
        window.setTimeout(function () {
            applicationId.textContent = generateApplicationId();
            showView("success");
            applicationForm.reset();
            applyExperienceMode();
        }, 1400);
    });

    /* Expose openModal for potential external use (e.g. sendPrompt-driven flows) */
    window.cloudibellOpenApplicationModal = openModal;
})();