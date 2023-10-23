document.addEventListener("DOMContentLoaded", function () {
  // Get all modal trigger buttons
  var modalTriggerButtons = document.querySelectorAll('[data-toggle="modal"]');

  // Attach click event listeners to all trigger buttons
  modalTriggerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Get the target modal ID
      var targetModalId = button.getAttribute("data-target");
      var modal = document.querySelector(targetModalId);

      if (modal) {
        // Create and append the backdrop element
        var backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop fade";
        document.body.appendChild(backdrop);

        backdrop.offsetWidth; // This triggers a reflow, allowing the "fade" class to work
        backdrop.classList.add("show");

        // Display the modal
        setTimeout(() => {
          modal.style.display = "block";
        }, 80);
        setTimeout(() => {
          modal.classList.add("show");
        }, 100);

        // Get the close button within the modal
        var closeButtons = modal.querySelectorAll('[data-dismiss="modal"]');

        // Close the modal and remove the backdrop when the close button is clicked
        closeButtons.forEach(function (closeButton) {
          closeButton.addEventListener("click", function () {
            modal.classList.remove("show");
            setTimeout(() => {
              modal.style.display = "none";
            }, 100);
            setTimeout(() => {
              backdrop.classList.remove("show");
              backdrop.addEventListener(
                "transitionend",
                function () {
                  backdrop.remove();
                },
                { once: true }
              );
            }, 150);
          });
        });

        // Close the modal and remove the backdrop when clicking anywhere outside of it
        window.addEventListener("click", function (event) {
          console.log(event.target);
          if (event.target == modal) {
            modal.classList.remove("show");
            setTimeout(() => {
              modal.style.display = "none";
            }, 100);
            setTimeout(() => {
              backdrop.classList.remove("show");
              backdrop.addEventListener(
                "transitionend",
                function () {
                  backdrop.remove();
                },
                { once: true }
              );
            }, 150);
          }
        });
      }
    });
  });

  const elementsWithDataToggle = document.querySelectorAll(
    '[data-toggle="collapse"]'
  );
  const navbarToggler = document.querySelector(".navbar-toggler");

  elementsWithDataToggle.forEach(function (element) {
    element.addEventListener("click", function () {
      const targetSelector = element.getAttribute("data-target");
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        if (targetElement.classList.contains("show")) {
          targetElement.classList.remove("show");
          navbarToggler.classList.remove("collapsed");
        } else {
          targetElement.classList.add("show");
          navbarToggler.classList.add("collapsed");
        }
      }
    });
  });
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  dropdownToggle.addEventListener("click", function () {
    if (!dropdownMenu.classList.contains("show")) {
      dropdownMenu.classList.add("show");
    } else {
      dropdownMenu.classList.remove("show");
    }
  });

  // Close the dropdown when clicking outside of it
  window.addEventListener("click", function (event) {
    if (
      event.target !== dropdownToggle &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  });

  // Prevent the dropdown from closing when clicking inside it
  dropdownMenu.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  const accordionButtons = document.querySelectorAll(".accordion-button");

  accordionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      button.classList.toggle("collapsed");
      const target = button.getAttribute("data-bs-target");
      const collapse = document.querySelector(target);
      if (collapse.classList.contains("show")) {
        collapse.classList.remove("show");
      } else {
        collapse.classList.add("show");
      }
    });
  });
});
