(() => {
  const photos = Array.isArray(window.photoData) ? window.photoData : [];
  const favoriteStorageKey = "gokhan-photo-favorites-v1";
  const grid = document.querySelector("#photo-grid");
  const count = document.querySelector("#photo-count");
  const yearRange = document.querySelector("#year-range");
  const archiveYearRange = "2007—2011";
  const lightbox = document.querySelector("#photo-lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxTitle = document.querySelector("#lightbox-title");
  const lightboxMeta = document.querySelector("#lightbox-meta");
  const lightboxCounter = document.querySelector("#lightbox-counter");
  const lightboxClose = document.querySelector("#lightbox-close");
  const lightboxPrev = document.querySelector("#lightbox-prev");
  const lightboxNext = document.querySelector("#lightbox-next");
  const lightboxFavorite = document.querySelector("#lightbox-favorite");
  const lightboxDownload = document.querySelector("#lightbox-download");

  if (!grid || !lightbox || !photos.length) {
    return;
  }

  const state = {
    view: "masonry",
    orderedPhotos: photos.slice(),
    visiblePhotos: [],
    activeIndex: -1,
    lastFocused: null,
  };

  let favorites = loadFavorites();

  function loadFavorites() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(favoriteStorageKey) || "[]");
      return new Set(Array.isArray(stored) ? stored : []);
    } catch (error) {
      return new Set();
    }
  }

  function saveFavorites() {
    try {
      window.localStorage.setItem(favoriteStorageKey, JSON.stringify([...favorites]));
    } catch (error) {
      // Favorites still work for this session when storage is unavailable.
    }
  }

  function getVisiblePhotos() {
    return state.orderedPhotos.slice();
  }

  function getOrientation(photo) {
    const ratio = photo.width / photo.height;
    if (ratio > 1.55) {
      return "wide";
    }
    if (ratio > 1.05) {
      return "landscape";
    }
    if (ratio < 0.8) {
      return "portrait";
    }
    return "squareish";
  }

  function makeIconLabel(text) {
    const label = document.createElement("span");
    label.className = "visually-hidden";
    label.textContent = text;
    return label;
  }

  function makeFavoriteButton(photo) {
    const button = document.createElement("button");
    const isFavorite = favorites.has(photo.id);
    button.className = "photo-favorite";
    button.type = "button";
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute("aria-label", `${isFavorite ? "Remove" : "Add"} ${photo.title} ${isFavorite ? "from" : "to"} favorites`);
    button.title = isFavorite ? "Remove from favorites" : "Add to favorites";

    const star = document.createElement("span");
    star.setAttribute("aria-hidden", "true");
    star.textContent = isFavorite ? "★" : "☆";
    button.append(star, makeIconLabel(isFavorite ? "Favorited" : "Favorite"));
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(photo.id);
    });
    return button;
  }

  function makePhotoCard(photo, index) {
    const card = document.createElement("article");
    card.className = `photo-card photo-card-${getOrientation(photo)}`;
    card.dataset.photoId = photo.id;

    const imageButton = document.createElement("button");
    imageButton.className = "photo-image-button";
    imageButton.type = "button";
    imageButton.setAttribute("aria-label", `Open ${photo.title}`);
    imageButton.addEventListener("click", () => openLightbox(index));

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.title;
    image.width = photo.width;
    image.height = photo.height;
    image.loading = index < 12 ? "eager" : "lazy";
    image.decoding = "async";
    imageButton.append(image);

    const caption = document.createElement("div");
    caption.className = "photo-card-caption";

    const captionCopy = document.createElement("div");
    captionCopy.className = "photo-caption-copy";
    const title = document.createElement("p");
    title.className = "photo-title";
    title.textContent = photo.title;
    const metadata = document.createElement("span");
    metadata.className = "photo-year";
    metadata.textContent = photo.year ? String(photo.year) : "Archive";
    captionCopy.append(title, metadata);

    const captionActions = document.createElement("div");
    captionActions.className = "photo-caption-actions";
    captionActions.append(makeFavoriteButton(photo));
    const number = document.createElement("span");
    number.className = "photo-number";
    number.textContent = String(index + 1).padStart(2, "0");
    captionActions.append(number);

    caption.append(captionCopy, captionActions);
    card.append(imageButton, caption);
    return card;
  }

  function renderGallery() {
    state.visiblePhotos = getVisiblePhotos();
    grid.className = `photo-grid view-${state.view}`;
    if (state.view === "masonry") {
      const columnCount = getMasonryColumnCount();
      const columns = Array.from({ length: columnCount }, () => {
        const column = document.createElement("div");
        column.className = "photo-masonry-column";
        return column;
      });
      state.visiblePhotos.forEach((photo, index) => {
        columns[index % columnCount].append(makePhotoCard(photo, index));
      });
      grid.replaceChildren(...columns);
    } else {
      grid.replaceChildren(...state.visiblePhotos.map(makePhotoCard));
    }

  }

  function getMasonryColumnCount() {
    if (window.matchMedia("(max-width: 460px)").matches) {
      return 1;
    }
    if (window.matchMedia("(max-width: 780px)").matches) {
      return 2;
    }
    if (window.matchMedia("(max-width: 960px)").matches) {
      return 3;
    }
    return 4;
  }

  function toggleFavorite(id) {
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }
    saveFavorites();
    renderGallery();

    if (!lightbox.hidden) {
      const current = state.visiblePhotos.findIndex((photo) => photo.id === id);
      if (current === -1) {
        closeLightbox();
      } else {
        state.activeIndex = current;
        updateLightbox();
      }
    }
  }

  function updateLightbox() {
    const photo = state.visiblePhotos[state.activeIndex];
    if (!photo) {
      return;
    }

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxMeta.textContent = photo.year ? String(photo.year) : "Photography archive";
    lightboxCounter.textContent = `${String(state.activeIndex + 1).padStart(2, "0")} / ${String(state.visiblePhotos.length).padStart(2, "0")}`;
    lightboxDownload.href = photo.src;
    lightboxDownload.download = photo.src.split("/").pop();

    const isFavorite = favorites.has(photo.id);
    lightboxFavorite.setAttribute("aria-pressed", String(isFavorite));
    lightboxFavorite.innerHTML = `<span aria-hidden="true">${isFavorite ? "★" : "☆"}</span> ${isFavorite ? "Favorited" : "Favorite"}`;
  }

  function openLightbox(index) {
    if (!state.visiblePhotos.length) {
      return;
    }
    state.activeIndex = index;
    state.lastFocused = document.activeElement;
    updateLightbox();
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
    if (state.lastFocused && typeof state.lastFocused.focus === "function") {
      state.lastFocused.focus();
    }
  }

  function showPreviousPhoto() {
    if (!state.visiblePhotos.length) {
      return;
    }
    state.activeIndex = (state.activeIndex - 1 + state.visiblePhotos.length) % state.visiblePhotos.length;
    updateLightbox();
  }

  function showNextPhoto() {
    if (!state.visiblePhotos.length) {
      return;
    }
    state.activeIndex = (state.activeIndex + 1) % state.visiblePhotos.length;
    updateLightbox();
  }

  count.textContent = String(photos.length);
  yearRange.textContent = archiveYearRange;

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPreviousPhoto);
  lightboxNext.addEventListener("click", showNextPhoto);
  lightboxFavorite.addEventListener("click", () => {
    const photo = state.visiblePhotos[state.activeIndex];
    if (photo) {
      toggleFavorite(photo.id);
    }
  });
  lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showPreviousPhoto();
    } else if (event.key === "ArrowRight") {
      showNextPhoto();
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    if (state.view !== "masonry") {
      return;
    }
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderGallery, 120);
  });
  renderGallery();
})();
