/* =========================================================
   Cloudibell Tech — Careers page logic
   Vanilla JS, no external libraries.

   Sections in this file:
   1. Utilities (debounce, toast, ripple, date helpers)
   2. Job data
   3. State (saved jobs, recently viewed, compare — all localStorage)
   4. Rendering (cards, skeletons, badges, pagination)
   5. Search / filter / sort
   6. Job details modal + recently viewed
   7. Save job / share job
   8. Job comparison
   9. Back to top
   10. Scroll reveal
   11. FAQ accordion
   12. Application modal + form validation (existing behaviour, unchanged)
   ========================================================= */
(function () {
    "use strict";

    /* =====================================================
       1. UTILITIES
       ===================================================== */
    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var args = arguments;
            var context = this;
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    function readStorage(key, fallback) {
        try {
            var raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            /* localStorage unavailable — feature degrades gracefully */
        }
    }

    function formatDate(isoString) {
        var d = new Date(isoString + "T00:00:00");
        if (isNaN(d.getTime())) return isoString;
        var months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
    }

    function daysBetween(fromIso, toIso) {
        var from = new Date(fromIso + "T00:00:00");
        var to = new Date(toIso + "T00:00:00");
        return Math.round((to - from) / (1000 * 60 * 60 * 24));
    }

    /* "Today" — anchored to the current date. */
    var TODAY_ISO = new Date().toISOString().slice(0, 10);

    /* Toast notifications */
    var toastEl = document.getElementById("toast");
    var toastTimer = null;
    function showToast(message) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.hidden = false;
        window.requestAnimationFrame(function () {
            toastEl.classList.add("is-visible");
        });
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            toastEl.classList.remove("is-visible");
            window.setTimeout(function () { toastEl.hidden = true; }, 250);
        }, 2400);
    }

    /* Ripple effect for .cr-ripple buttons */
    document.addEventListener("click", function (e) {
        var target = e.target.closest(".cr-ripple");
        if (!target) return;
        var rect = target.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var ripple = document.createElement("span");
        ripple.className = "cr-ripple-effect";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
        target.appendChild(ripple);
        window.setTimeout(function () { ripple.remove(); }, 650);
    });

    /* =====================================================
       2. JOB DATA
       ===================================================== */
    var JOBS = [
        {
            id: "react-native-intern",
            jobId: "CBT-DEV-1009",
            title: "React Native Intern",
            department: "Development",
            location: "Bangalore",
            employmentType: "Internship",
            experienceBucket: "Fresher",
            experienceLabel: "Fresher",
            workingHours: "Mon\u2013Fri, 10:00 AM \u2013 6:00 PM IST",
            salary: "\u20B915,000\u201320,000 / month stipend",
            salaryMin: 1.8, salaryMax: 2.4,
            posted: "2026-07-14",
            deadline: "2026-07-31",
            applicants: 40,
            urgent: false, hot: false,
            description: "A hands-on internship building screens and features for an internal mobile companion app alongside our engineering team.",
            skills: ["React Native", "JavaScript", "Git"],
            responsibilities: [
                "Build and style screens for an internal React Native app.",
                "Fix bugs and small feature requests under mentor guidance.",
                "Attend daily standups and demo work at the end of each sprint."
            ],
            qualifications: ["Currently pursuing or recently completed a degree in CS/IT", "Basic familiarity with JavaScript and React concepts"],
            preferredSkills: ["Personal projects on GitHub", "Curiosity about mobile UX"],
            benefits: ["Certification Support", "Learning Budget"]
        },
        {
            id: "devops-contractor",
            jobId: "CBT-DEV-1010",
            title: "DevOps Contractor",
            department: "Development",
            location: "Remote",
            employmentType: "Contract",
            experienceBucket: "2-5",
            experienceLabel: "2-5 Years",
            workingHours: "Flexible, core hours 11 AM \u2013 4 PM IST",
            salary: "\u20B98-12 LPA (contract)",
            salaryMin: 8, salaryMax: 12,
            posted: "2026-06-15",
            deadline: "2026-08-10",
            applicants: 5,
            urgent: false, hot: false,
            description: "A fixed-term engagement to harden our CI/CD pipelines and containerize a handful of internal services.",
            skills: ["AWS", "CI/CD", "Docker", "Kubernetes"],
            responsibilities: [
                "Set up and maintain CI/CD pipelines for internal services.",
                "Containerize existing services and document deployment steps.",
                "Advise the team on AWS cost and reliability improvements."
            ],
            qualifications: ["2+ years hands-on DevOps or SRE experience", "Comfortable working independently on a fixed-term engagement"],
            preferredSkills: ["Terraform", "Monitoring/observability tooling"],
            benefits: ["Flexible Work", "Performance Bonus"]
        },
        {
            id: "manual-qa-tester",
            jobId: "CBT-QA-1011",
            title: "Manual QA Tester",
            department: "Testing",
            location: "Hyderabad",
            employmentType: "Full Time",
            experienceBucket: "Fresher",
            experienceLabel: "Fresher",
            workingHours: "Mon\u2013Fri, 9:30 AM \u2013 6:30 PM IST",
            salary: "\u20B93-4 LPA",
            salaryMin: 3, salaryMax: 4,
            posted: "2026-07-05",
            deadline: "2026-09-05",
            applicants: 14,
            urgent: false, hot: false,
            description: "Get hands-on QA experience testing real client releases before they ship, with mentorship from senior QA engineers.",
            skills: ["Manual Testing", "Bug Tracking", "JIRA"],
            responsibilities: [
                "Execute test cases against new releases and log defects.",
                "Track issues through resolution using JIRA.",
                "Support regression testing ahead of client releases."
            ],
            qualifications: ["Bachelor's degree in any technical discipline", "Attention to detail and clear bug-writing skills"],
            preferredSkills: ["Exposure to any automation tool", "Basic SQL"],
            benefits: ["Health Insurance", "Paid Leave"]
        },
        {
            id: "business-analyst-intern",
            jobId: "CBT-BA-1012",
            title: "Business Analyst Intern",
            department: "Business Analyst",
            location: "Bangalore",
            employmentType: "Internship",
            experienceBucket: "Fresher",
            experienceLabel: "Fresher",
            workingHours: "Mon\u2013Fri, 10:00 AM \u2013 6:00 PM IST",
            salary: "\u20B912,000\u201315,000 / month stipend",
            salaryMin: 1.4, salaryMax: 1.8,
            posted: "2026-06-10",
            deadline: "2026-07-05",
            applicants: 22,
            urgent: false, hot: false,
            description: "Shadow business analysts on live client engagements and help document requirements and process flows.",
            skills: ["Excel", "Documentation", "Communication"],
            responsibilities: [
                "Support requirement documentation for live client projects.",
                "Help prepare process maps and workshop notes.",
                "Assist with meeting coordination and follow-ups."
            ],
            qualifications: ["Currently pursuing a degree in business, IT or a related field", "Comfortable with Excel and written documentation"],
            preferredSkills: ["Prior coursework in business analysis", "Interest in Salesforce/CRM systems"],
            benefits: ["Certification Support", "Learning Budget"]
        },
        {
            id: "senior-qa-automation",
            jobId: "CBT-QA-1013",
            title: "Senior QA Automation Engineer",
            department: "Testing",
            location: "Hyderabad",
            employmentType: "Full Time",
            experienceBucket: "5+",
            experienceLabel: "5+ Years",
            workingHours: "Mon\u2013Fri, 9:30 AM \u2013 6:30 PM IST",
            salary: "\u20B912-18 LPA",
            salaryMin: 12, salaryMax: 18,
            posted: "2026-06-05",
            deadline: "2026-08-18",
            applicants: 8,
            urgent: false, hot: true,
            description: "Lead automation strategy across our delivery pods and mentor QA engineers building out our Selenium and API suites.",
            skills: ["Selenium", "Java", "API Testing", "CI/CD"],
            responsibilities: [
                "Own the automation framework used across delivery pods.",
                "Build and maintain API and UI automation suites.",
                "Mentor QA engineers and set testing best practices."
            ],
            qualifications: ["5+ years in QA with strong automation experience", "Proven experience owning a test framework end to end"],
            preferredSkills: ["Performance testing tools", "Salesforce testing experience"],
            benefits: ["Performance Bonus", "Certification Support", "Health Insurance"]
        },
        {
            id: "hr-business-partner",
            jobId: "CBT-HR-1014",
            title: "HR Business Partner",
            department: "HR",
            location: "Bangalore",
            employmentType: "Full Time",
            experienceBucket: "2-5",
            experienceLabel: "2-5 Years",
            workingHours: "Mon\u2013Fri, 9:30 AM \u2013 6:30 PM IST",
            salary: "\u20B98-12 LPA",
            salaryMin: 8, salaryMax: 12,
            posted: "2026-05-20",
            deadline: "2026-09-20",
            applicants: 3,
            urgent: false, hot: false,
            description: "Partner with delivery leads on performance, engagement and policy to keep Cloudibell a place people want to stay.",
            skills: ["Employee Relations", "HRBP", "Policy"],
            responsibilities: [
                "Partner with delivery leads on performance and engagement.",
                "Advise on and refine HR policy as the team scales.",
                "Handle employee relations matters with care and discretion."
            ],
            qualifications: ["2-5 years as an HRBP or generalist", "Strong judgement handling sensitive matters"],
            preferredSkills: ["Experience in a tech/consulting environment", "HRIS tooling experience"],
            benefits: ["Health Insurance", "Paid Leave", "Performance Bonus"]
        }
    ];

    /* =====================================================
       3. STATE
       ===================================================== */
    var STORAGE_KEYS = {
        saved: "cloudibell_saved_jobs",
        recent: "cloudibell_recently_viewed"
    };

    var savedJobIds = new Set(readStorage(STORAGE_KEYS.saved, []));
    var recentlyViewedIds = readStorage(STORAGE_KEYS.recent, []);
    var compareSelection = [];
    var showSavedOnly = false;
    var visibleCount = 6;
    var PAGE_SIZE = 6;
    var filteredJobs = JOBS.slice();
    var currentDetailsJobId = null;

    function jobById(id) {
        for (var i = 0; i < JOBS.length; i++) {
            if (JOBS[i].id === id) return JOBS[i];
        }
        return null;
    }

    function persistSaved() {
        writeStorage(STORAGE_KEYS.saved, Array.from(savedJobIds));
    }

    function persistRecent() {
        writeStorage(STORAGE_KEYS.recent, recentlyViewedIds);
    }

    /* =====================================================
       4. RENDERING
       ===================================================== */
    var jobsGrid = document.getElementById("jobsGrid");
    var skeletonGrid = document.getElementById("skeletonGrid");
    var jobCardTemplate = document.getElementById("jobCardTemplate");
    var resultsCount = document.getElementById("resultsCount");
    var noResults = document.getElementById("noResults");
    var loadMoreBtn = document.getElementById("loadMoreBtn");
    var savedJobsCountEl = document.getElementById("savedJobsCount");

    function isClosed(job) {
        return daysBetween(TODAY_ISO, job.deadline) < 0;
    }

    function isNew(job) {
        var age = daysBetween(job.posted, TODAY_ISO);
        return age >= 0 && age <= 7;
    }

    function buildBadges(job) {
        var badges = [];
        if (isClosed(job)) {
            badges.push({ label: "Closed", cls: "cr-badge--closed" });
            return badges;
        }
        if (isNew(job)) badges.push({ label: "New", cls: "cr-badge--new" });
        if (job.urgent) badges.push({ label: "Urgent", cls: "cr-badge--urgent" });
        if (job.location === "Remote") badges.push({ label: "Remote", cls: "cr-badge--remote" });
        if (job.hot) badges.push({ label: "Hot", cls: "cr-badge--hot" });
        if (job.employmentType === "Internship") badges.push({ label: "Internship", cls: "cr-badge--internship" });
        if (job.employmentType === "Full Time") badges.push({ label: "Full Time", cls: "cr-badge--fulltime" });
        return badges;
    }

    function renderBadgesInto(container, job) {
        container.innerHTML = "";
        buildBadges(job).forEach(function (badge) {
            var span = document.createElement("span");
            span.className = "cr-badge " + badge.cls;
            span.textContent = badge.label;
            container.appendChild(span);
        });
    }

    function applicantsLabel(job) {
        return job.applicants > 0 ? job.applicants + " people applied" : "New Opening";
    }

    function renderJobCard(job) {
        var node = jobCardTemplate.content.cloneNode(true);
        var card = node.querySelector(".cr-job-card");
        card.dataset.jobId = job.id;

        renderBadgesInto(node.querySelector(".cr-job-badges"), job);

        var saveBtn = node.querySelector(".cr-job-save");
        var isSaved = savedJobIds.has(job.id);
        saveBtn.classList.toggle("is-saved", isSaved);
        saveBtn.setAttribute("aria-pressed", String(isSaved));
        saveBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleSaveJob(job.id);
        });

        node.querySelector(".cr-job-title").textContent = job.title;
        node.querySelector(".cr-job-type").textContent = job.employmentType;
        node.querySelector(".cr-job-location").textContent = job.location;
        node.querySelector(".cr-job-experience").textContent = job.experienceLabel;
        node.querySelector(".cr-job-department").textContent = job.department;
        node.querySelector(".cr-job-salary").textContent = job.salary;
        node.querySelector(".cr-job-desc").textContent = job.description;

       

        node.querySelector(".cr-job-applicants").textContent = applicantsLabel(job);
        var deadlineEl = node.querySelector(".cr-job-deadline");
        var closed = isClosed(job);
        deadlineEl.textContent = closed ? "Closed" : "Apply before " + formatDate(job.deadline);
        deadlineEl.classList.toggle("is-closed", closed);

        var compareCheckbox = node.querySelector(".cr-compare-checkbox");
        compareCheckbox.checked = compareSelection.indexOf(job.id) !== -1;
        compareCheckbox.addEventListener("click", function (e) { e.stopPropagation(); });
        compareCheckbox.addEventListener("change", function () {
            toggleCompareSelection(job.id, compareCheckbox);
        });

        var shareBtn = node.querySelector(".cr-job-share");
        shareBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            shareJob(job);
        });

        var applyBtn = node.querySelector(".cr-job-apply");
        if (closed) {
            applyBtn.textContent = "Closed";
            applyBtn.disabled = true;
        }
        applyBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            openJobDetails(job.id);
        });

        card.addEventListener("click", function () {
            openJobDetails(job.id);
        });

        return node;
    }

    function renderPage() {
        var visible = filteredJobs.slice(0, visibleCount);

        if (!visible.length) {
            jobsGrid.innerHTML = "";
            noResults.hidden = false;
            resultsCount.textContent = "0 roles found";
            loadMoreBtn.hidden = true;
            return;
        }

        // ADD THESE 2 LINES
        skeletonGrid.style.display = "none";
        jobsGrid.hidden = false;

        noResults.hidden = true;
        resultsCount.textContent =
            filteredJobs.length +
            (filteredJobs.length === 1 ? " role found" : " roles found");

        jobsGrid.innerHTML = "";

        var fragment = document.createDocumentFragment();

        visible.forEach(function(job) {
            fragment.appendChild(renderJobCard(job));
        });

        jobsGrid.appendChild(fragment);

        loadMoreBtn.hidden = visibleCount >= filteredJobs.length;

        observeReveals();
    }
    function updateSavedCount() {
        if (savedJobsCountEl) savedJobsCountEl.textContent = String(savedJobIds.size);
    }

    /* Skeleton loading — shown for ~1s on first load only */
    function runInitialSkeletonThenRender() {
        skeletonGrid.hidden = false;
        jobsGrid.hidden = true;
        window.setTimeout(function () {
            skeletonGrid.hidden = true;
            jobsGrid.hidden = false;
            applyFiltersAndRender();
        }, 1000);
    }

    /* =====================================================
       5. SEARCH / FILTER / SORT
       ===================================================== */
    var searchTitle = document.getElementById("searchTitle");
    var searchSkill = document.getElementById("searchSkill");
    var searchKeyword = document.getElementById("searchKeyword");
    var filterDepartment = document.getElementById("filterDepartment");
    var filterExperience = document.getElementById("filterExperience");
    var filterLocation = document.getElementById("filterLocation");
    var filterType = document.getElementById("filterType");
    var sortJobs = document.getElementById("sortJobs");
    var filterForm = document.getElementById("filterForm");
    var resetFiltersBtn = document.getElementById("resetFilters");
    var emptyResetBtn = document.getElementById("emptyResetBtn");
    var savedJobsToggle = document.getElementById("savedJobsToggle");

    function sortJobList(list) {
        var mode = sortJobs.value;
        var sorted = list.slice();
        switch (mode) {
            case "salary-high":
                sorted.sort(function (a, b) { return b.salaryMax - a.salaryMax; });
                break;
            case "salary-low":
                sorted.sort(function (a, b) { return a.salaryMin - b.salaryMin; });
                break;
            case "experience":
                var order = { "Fresher": 0, "0-2": 1, "2-5": 2, "5+": 3 };
                sorted.sort(function (a, b) { return order[a.experienceBucket] - order[b.experienceBucket]; });
                break;
            case "location":
                sorted.sort(function (a, b) { return a.location.localeCompare(b.location); });
                break;
            case "alpha":
                sorted.sort(function (a, b) { return a.title.localeCompare(b.title); });
                break;
            case "newest":
            default:
                sorted.sort(function (a, b) { return new Date(b.posted) - new Date(a.posted); });
                break;
        }
        return sorted;
    }

    /* Search matches Job Title, Skills, Department AND Location — each of
       the three search boxes checks all four fields, so "Java" matches by
       title, "Salesforce" matches by department, "Remote" matches by location. */
    function matchesAnyField(job, query) {
        if (!query) return true;
        var haystack = (job.title + " " + job.skills.join(" ") + " " +
            job.department + " " + job.location).toLowerCase();
        return haystack.indexOf(query) !== -1;
    }

    function applyFiltersAndRender(resetPagination) {
        var titleQ = searchTitle.value.trim().toLowerCase();
        var skillQ = searchSkill.value.trim().toLowerCase();
        var keywordQ = searchKeyword.value.trim().toLowerCase();
        var department = filterDepartment.value;
        var experience = filterExperience.value;
        var location = filterLocation.value;
        var type = filterType.value;

        var results = JOBS.filter(function (job) {
            var matchesTitle = matchesAnyField(job, titleQ);
            var matchesSkill = matchesAnyField(job, skillQ);
            var matchesKeyword = matchesAnyField(job, keywordQ);
            var matchesDepartment = !department || job.department === department;
            var matchesExperience = !experience || job.experienceBucket === experience;
            var matchesLocation = !location || job.location === location;
            var matchesType = !type || job.employmentType === type;
            var matchesSaved = !showSavedOnly || savedJobIds.has(job.id);
            return matchesTitle && matchesSkill && matchesKeyword && matchesDepartment &&
                matchesExperience && matchesLocation && matchesType && matchesSaved;
        });

        filteredJobs = sortJobList(results);

        if (resetPagination !== false) visibleCount = PAGE_SIZE;
        renderPage();
    }

    var debouncedFilter = debounce(function () { applyFiltersAndRender(true); }, 300);

    [searchTitle, searchSkill, searchKeyword].forEach(function (field) {
        field.addEventListener("input", debouncedFilter);
    });

    [filterDepartment, filterExperience, filterLocation, filterType, sortJobs].forEach(function (field) {
        field.addEventListener("change", function () { applyFiltersAndRender(true); });
    });

    filterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        applyFiltersAndRender(true);
    });

    function resetAllFilters() {
        filterForm.reset();
        showSavedOnly = false;
        savedJobsToggle.setAttribute("aria-pressed", "false");
        applyFiltersAndRender(true);
    }

    resetFiltersBtn.addEventListener("click", resetAllFilters);
    emptyResetBtn.addEventListener("click", resetAllFilters);

    savedJobsToggle.addEventListener("click", function () {
        showSavedOnly = !showSavedOnly;
        savedJobsToggle.setAttribute("aria-pressed", String(showSavedOnly));
        applyFiltersAndRender(true);
    });

    loadMoreBtn.addEventListener("click", function () {
        visibleCount += PAGE_SIZE;
        renderPage();
    });

    /* =====================================================
       6. JOB DETAILS MODAL + RECENTLY VIEWED
       ===================================================== */
    var detailsOverlay = document.getElementById("detailsOverlay");
    var detailsCloseBtn = document.getElementById("detailsCloseBtn");
    var detailsCloseBtn2 = document.getElementById("detailsCloseBtn2");
    var detailsApplyBtn = document.getElementById("detailsApplyBtn");
    var detailsSaveBtn = document.getElementById("detailsSaveBtn");
    var detailsShareBtn = document.getElementById("detailsShareBtn");

    function renderList(container, items) {
        container.innerHTML = "";
        items.forEach(function (item) {
            var li = document.createElement("li");
            li.textContent = item;
            container.appendChild(li);
        });
    }

    function renderPills(container, items) {
        container.innerHTML = "";
        items.forEach(function (item) {
            var span = document.createElement("span");
            span.textContent = item;
            container.appendChild(span);
        });
    }

    function openJobDetails(jobId) {
        var job = jobById(jobId);
        if (!job) return;
        currentDetailsJobId = jobId;

        renderBadgesInto(document.getElementById("detailsBadges"), job);
        document.getElementById("detailsTitle").textContent = job.title;
        document.getElementById("detailsDepartment").textContent = job.department;
        document.getElementById("detailsLocation").textContent = job.location;
        document.getElementById("detailsType").textContent = job.employmentType;
        document.getElementById("detailsSalary").textContent = job.salary;
        document.getElementById("detailsExperience").textContent = job.experienceLabel;
        document.getElementById("detailsWorkingHours").textContent = job.workingHours;
        document.getElementById("detailsJobId").textContent = job.jobId;
        document.getElementById("detailsPosted").textContent = formatDate(job.posted);
        var closed = isClosed(job);
        document.getElementById("detailsDeadline").textContent = closed ? "Closed" : formatDate(job.deadline);
        document.getElementById("detailsApplicants").textContent = applicantsLabel(job);

        renderPills(document.getElementById("detailsSkills"), job.skills);
        renderList(document.getElementById("detailsResponsibilities"), job.responsibilities);
        renderList(document.getElementById("detailsQualifications"), job.qualifications);
        renderPills(document.getElementById("detailsPreferredSkills"), job.preferredSkills);
        renderPills(document.getElementById("detailsBenefits"), job.benefits);

        var isSaved = savedJobIds.has(job.id);
        detailsSaveBtn.classList.toggle("is-saved", isSaved);
        detailsSaveBtn.setAttribute("aria-pressed", String(isSaved));

        detailsApplyBtn.disabled = closed;
        detailsApplyBtn.textContent = closed ? "Applications Closed" : "Apply Now";

        detailsOverlay.hidden = false;
        document.body.style.overflow = "hidden";

        addToRecentlyViewed(job.id);
    }

    function closeJobDetails() {
        detailsOverlay.hidden = true;
        document.body.style.overflow = "";
        currentDetailsJobId = null;
    }

    detailsCloseBtn.addEventListener("click", closeJobDetails);
    detailsCloseBtn2.addEventListener("click", closeJobDetails);
    detailsOverlay.addEventListener("click", function (e) {
        if (e.target === detailsOverlay) closeJobDetails();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !detailsOverlay.hidden) closeJobDetails();
    });

    /* Apply Now inside the details modal: close this modal, then open the
       existing application form modal with the job title pre-filled. */
    detailsApplyBtn.addEventListener("click", function () {
        if (detailsApplyBtn.disabled) return;
        var job = jobById(currentDetailsJobId);
        closeJobDetails();
        if (job) openModal(job.title);
    });

    detailsSaveBtn.addEventListener("click", function () {
        if (currentDetailsJobId) toggleSaveJob(currentDetailsJobId);
        var isSaved = savedJobIds.has(currentDetailsJobId);
        detailsSaveBtn.classList.toggle("is-saved", isSaved);
        detailsSaveBtn.setAttribute("aria-pressed", String(isSaved));
    });

    detailsShareBtn.addEventListener("click", function () {
        var job = jobById(currentDetailsJobId);
        if (job) shareJob(job);
    });

    /* Recently viewed */
    var recentlyViewedSection = document.getElementById("recentlyViewed");
    var recentlyViewedTrack = document.getElementById("recentlyViewedTrack");
    var recentCardTemplate = document.getElementById("recentCardTemplate");
    var MAX_RECENT = 8;

    function addToRecentlyViewed(jobId) {
        recentlyViewedIds = recentlyViewedIds.filter(function (id) { return id !== jobId; });
        recentlyViewedIds.unshift(jobId);
        if (recentlyViewedIds.length > MAX_RECENT) recentlyViewedIds.length = MAX_RECENT;
        persistRecent();
        renderRecentlyViewed();
    }

    function renderRecentlyViewed() {
        var validIds = recentlyViewedIds.filter(function (id) { return jobById(id); });
        if (!validIds.length) {
            recentlyViewedSection.hidden = true;
            return;
        }
        recentlyViewedSection.hidden = false;
        recentlyViewedTrack.innerHTML = "";
        validIds.forEach(function (id) {
            var job = jobById(id);
            var node = recentCardTemplate.content.cloneNode(true);
            node.querySelector(".cr-recent-card-title").textContent = job.title;
            node.querySelector(".cr-recent-card-meta").textContent = job.location + " \u00B7 " + job.salary;
            node.querySelector(".cr-recent-card").addEventListener("click", function () {
                openJobDetails(job.id);
            });
            recentlyViewedTrack.appendChild(node);
        });
    }

    /* =====================================================
       7. SAVE JOB / SHARE JOB
       ===================================================== */
    function toggleSaveJob(jobId) {
        var job = jobById(jobId);
        if (!job) return;
        if (savedJobIds.has(jobId)) {
            savedJobIds.delete(jobId);
            showToast("Removed \u201C" + job.title + "\u201D from saved jobs.");
        } else {
            savedJobIds.add(jobId);
            showToast("Saved \u201C" + job.title + "\u201D to your list.");
        }
        persistSaved();
        updateSavedCount();

        /* keep every rendered instance of this card/modal in sync */
        document.querySelectorAll('.cr-job-card[data-job-id="' + jobId + '"] .cr-job-save').forEach(function (btn) {
            var isSaved = savedJobIds.has(jobId);
            btn.classList.toggle("is-saved", isSaved);
            btn.setAttribute("aria-pressed", String(isSaved));
        });
        if (currentDetailsJobId === jobId) {
            var isSaved = savedJobIds.has(jobId);
            detailsSaveBtn.classList.toggle("is-saved", isSaved);
            detailsSaveBtn.setAttribute("aria-pressed", String(isSaved));
        }
        if (showSavedOnly) applyFiltersAndRender(false);
    }

    function shareJob(job) {
        var url = window.location.origin + window.location.pathname + "?job=" + encodeURIComponent(job.id);
        if (navigator.share) {
            navigator.share({ title: job.title + " | Cloudibell Tech", text: "Check out this role at Cloudibell Tech.", url: url })
                .catch(function () { /* user cancelled share — no action needed */ });
            return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
                showToast("Link copied to clipboard.");
            }).catch(function () {
                showToast("Couldn't copy the link — copy it from your address bar instead.");
            });
        } else {
            showToast("Share link: " + url);
        }
    }

    /* =====================================================
       8. JOB COMPARISON
       ===================================================== */
    var compareBar = document.getElementById("compareBar");
    var compareCountEl = document.getElementById("compareCount");
    var compareClearBtn = document.getElementById("compareClearBtn");
    var compareNowBtn = document.getElementById("compareNowBtn");
    var compareOverlay = document.getElementById("compareOverlay");
    var compareCloseBtn = document.getElementById("compareCloseBtn");
    var compareTable = document.getElementById("compareTable");

    function toggleCompareSelection(jobId, checkboxEl) {
        var idx = compareSelection.indexOf(jobId);
        if (idx !== -1) {
            compareSelection.splice(idx, 1);
        } else {
            if (compareSelection.length >= 2) {
                showToast("You can compare up to 2 jobs at a time.");
                checkboxEl.checked = false;
                return;
            }
            compareSelection.push(jobId);
        }
        updateCompareBar();
    }

    function updateCompareBar() {
        compareCountEl.textContent = String(compareSelection.length);
        compareBar.hidden = compareSelection.length === 0;
        compareNowBtn.disabled = compareSelection.length !== 2;
    }

    compareClearBtn.addEventListener("click", function () {
        compareSelection = [];
        document.querySelectorAll(".cr-compare-checkbox").forEach(function (cb) { cb.checked = false; });
        updateCompareBar();
    });

    compareNowBtn.addEventListener("click", function () {
        if (compareSelection.length !== 2) return;
        var jobA = jobById(compareSelection[0]);
        var jobB = jobById(compareSelection[1]);
        if (!jobA || !jobB) return;

        var rows = [
            ["", jobA.title, jobB.title],
            ["Salary", jobA.salary, jobB.salary],
            ["Location", jobA.location, jobB.location],
            ["Experience", jobA.experienceLabel, jobB.experienceLabel],
            ["Employment Type", jobA.employmentType, jobB.employmentType],
            ["Department", jobA.department, jobB.department],
            ["Skills", jobA.skills.join(", "), jobB.skills.join(", ")]
        ];

        compareTable.innerHTML = "";
        rows.forEach(function (row, i) {
            var tr = document.createElement("tr");
            row.forEach(function (cell, cIdx) {
                var el = document.createElement(i === 0 || cIdx === 0 ? "th" : "td");
                el.textContent = cell;
                tr.appendChild(el);
            });
            compareTable.appendChild(tr);
        });

        compareOverlay.hidden = false;
        document.body.style.overflow = "hidden";
    });

    function closeCompareModal() {
        compareOverlay.hidden = true;
        document.body.style.overflow = "";
    }

    compareCloseBtn.addEventListener("click", closeCompareModal);
    compareOverlay.addEventListener("click", function (e) {
        if (e.target === compareOverlay) closeCompareModal();
    });

    /* =====================================================
       9. BACK TO TOP
       ===================================================== */
    var backToTop = document.getElementById("backToTop");
    var backToTopVisible = false;

    window.addEventListener("scroll", debounce(function () {
        var shouldShow = window.scrollY > 480;
        if (shouldShow !== backToTopVisible) {
            backToTopVisible = shouldShow;
            backToTop.hidden = !shouldShow;
            window.requestAnimationFrame(function () {
                backToTop.classList.toggle("is-visible", shouldShow);
            });
        }
    }, 100));

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* =====================================================
       10. SCROLL REVEAL
       ===================================================== */
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

    /* =====================================================
       11. FAQ ACCORDION
       ===================================================== */
    document.querySelectorAll(".cr-accordion-trigger").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
            var expanded = trigger.getAttribute("aria-expanded") === "true";
            var panel = document.getElementById(trigger.getAttribute("aria-controls"));
            trigger.setAttribute("aria-expanded", String(!expanded));
            panel.hidden = expanded;
        });
    });

    /* =====================================================
       12. APPLICATION MODAL + FORM VALIDATION
       ===================================================== */
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

    /* Fresher / Experienced toggle */
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

    /* Form validation */
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

    /* Expose openModal for potential external use */
    window.cloudibellOpenApplicationModal = openModal;

    /* =====================================================
       INIT
       ===================================================== */
    updateSavedCount();
    renderRecentlyViewed();
    runInitialSkeletonThenRender();
})();