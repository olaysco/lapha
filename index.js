let popElemnts = document.querySelectorAll(".pop");
let previewBox = document.querySelector("#previewModal");
previewBox.addEventListener("show.bs.modal", function (event) {
  let button = event.relatedTarget;
  let imageSrc = button.querySelector("img").getAttribute("src");
  let title = button.getAttribute("data-bs-title");
  let description = button.getAttribute("data-bs-description");
  let previewTitle = previewBox.querySelector(".modal-body h5.title");
  let previewImg = previewBox.querySelector(".modal-body img.image");
  let previewDescription = previewBox.querySelector(
    ".modal-body p.description"
  );

  previewImg.setAttribute("src", imageSrc);
  previewTitle.textContent = title;
  previewDescription.textContent = description;
});
