const FEATURED_COUNT = 5;

const BREAKPOINTS = {
  tablet: 769,
  desktop: 1200,
};

const CATEGORY_LABELS = {
  "easy-care": "Easy Care",
  "low-light": "Low Light",
  "pet-friendly": "Pet Friendly",
  tropical: "Tropical",
  succulent: "Succulents",
};

const getCategoryLabel = (category) => CATEGORY_LABELS[category] ?? category;

const shufflePlants = (plants) => {
  const shuffled = [...plants];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

const getFeaturedPlants = (plants) =>
  shufflePlants(plants).slice(0, FEATURED_COUNT);

const getSlidesPerView = () => {
  if (window.innerWidth >= BREAKPOINTS.desktop) {
    return 3;
  }

  if (window.innerWidth >= BREAKPOINTS.tablet) {
    return 2;
  }

  return 1;
};

const createPlantCard = (plant) => {
  const item = document.createElement("li");
  const card = document.createElement("a");
  const imageWrap = document.createElement("div");
  const image = document.createElement("img");
  const body = document.createElement("div");
  const category = document.createElement("p");
  const name = document.createElement("h3");
  const description = document.createElement("p");
  const price = document.createElement("p");

  item.className = "plant-slider__item";

  card.className = "plant-card";
  card.href = "./catalog.html";
  card.setAttribute("aria-label", `View ${plant.name} in the catalog`);

  imageWrap.className = "plant-card__image-wrap";

  image.src = plant.image;
  image.alt = plant.name;
  image.className = "plant-card__image";
  image.width = 640;
  image.height = 800;

  body.className = "plant-card__body";

  category.className = "plant-card__category";
  category.textContent = plant.categories.map(getCategoryLabel).join(" · ");

  name.className = "plant-card__name";
  name.textContent = plant.name;

  description.className = "plant-card__description";
  description.textContent = plant.description;

  price.className = "plant-card__price";
  price.textContent = `$${plant.pricing.base}`;

  imageWrap.append(image);
  body.append(category, name, description, price);
  card.append(imageWrap, body);
  item.append(card);

  return item;
};

export const initSlider = (plants) => {
  const track = document.querySelector("[data-featured-track]");

  if (!track) return;

  const previousButton = document.querySelector("[data-slider-prev]");
  const nextButton = document.querySelector("[data-slider-next]");

  const featuredPlants = getFeaturedPlants(plants);

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();

  const updatePosition = () => {
    const cardWidth = 100 / slidesPerView;

    track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
  };

  const updateControls = () => {
    const maxIndex = Math.max(0, featuredPlants.length - slidesPerView);

    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }

    updatePosition();

    if (previousButton) {
      previousButton.disabled = featuredPlants.length <= slidesPerView;
    }

    if (nextButton) {
      nextButton.disabled = featuredPlants.length <= slidesPerView;
    }
  };

  const render = () => {
    track.replaceChildren(...featuredPlants.map(createPlantCard));

    updateControls();
  };

  previousButton?.addEventListener("click", () => {
    const maxIndex = Math.max(0, featuredPlants.length - slidesPerView);

    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;

    updatePosition();
  });

  nextButton?.addEventListener("click", () => {
    const maxIndex = Math.max(0, featuredPlants.length - slidesPerView);

    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;

    updatePosition();
  });

  window.addEventListener("resize", () => {
    const nextSlidesPerView = getSlidesPerView();

    if (nextSlidesPerView === slidesPerView) return;

    slidesPerView = nextSlidesPerView;
    currentIndex = 0;

    updateControls();
  });

  render();
};
