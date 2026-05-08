window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");

  setTimeout(() => {
    loader.classList.add("fade-out");

    setTimeout(() => {
      loader.style.display = "none";
    }, 700);

  }, 1200);
});