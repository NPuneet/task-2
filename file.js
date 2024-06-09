document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://dummyjson.com/products?limit=15";
  const productContainer = document.getElementById("product-container");

  // Fetched products from api and displayed them
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => renderProducts(data.products));

  function renderProducts(products) {
    // console.log(products)
    productContainer.innerHTML = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `<div class="productdiv">
                <img src="${product.images[0]}" class="product-image" alt="${
        product.title
      }">
                <h2>${product.title}</h2>
                <p id="price">Price: $${product.price.toFixed(2)}</p>
                <p id="discountedprice">Discounted Price: $${(
                  product.price / 10
                ).toFixed(2)}</p>
                <img src="${product.thumbnail}" class="thumbnail" alt="${
        product.title
      }">
                <p>Rating: ${product.rating}</p>
                <button class="toggle-description">Show Description</button>
                <div class="product-description">
                    <p>${product.description}</p>
                    <button class="less-description">Less Description</button>
                </div>
                </div>
            `;
      productContainer.appendChild(productCard);

      //  show/hide description
      productCard
        .querySelector(".toggle-description")
        .addEventListener("click", () => {
          const description = productCard.querySelector(".product-description");
          description.style.display = "block";
        });
      productCard
        .querySelector(".less-description")
        .addEventListener("click", () => {
          const description = productCard.querySelector(".product-description");
          description.style.display = "none";
        });
    });
  }

  // Sorting functionality
  document
    .getElementById("sortPriceAsc")
    .addEventListener("click", () => sortProducts("priceAsc"));
  document
    .getElementById("sortPriceDesc")
    .addEventListener("click", () => sortProducts("priceDesc"));
  document
    .getElementById("sortRatingDesc")
    .addEventListener("click", () => sortProducts("ratingDesc"));

  function sortProducts(criteria) {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        let sortedProducts = data.products;
        if (criteria === "priceAsc") {
          sortedProducts = sortedProducts.sort(
            (a, b) =>
              a.price -
              (a.price * a.discountPercentage) / 100 -
              (b.price - (b.price * b.discountPercentage) / 100)
          );
        } else if (criteria === "priceDesc") {
          sortedProducts = sortedProducts.sort(
            (a, b) =>
              b.price -
              (b.price * b.discountPercentage) / 100 -
              (a.price - (a.price * a.discountPercentage) / 100)
          );
        } else if (criteria === "ratingDesc") {
          sortedProducts = sortedProducts.sort((a, b) => b.rating - a.rating);
        }
        renderProducts(sortedProducts);
      });
  }

  // Search functionality
  document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    const searchUrl = `https://dummyjson.com/products/search?q=${query}`;
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => renderProducts(data.products));
  });

  document.getElementById("clearSearchButton").addEventListener("click", () => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => renderProducts(data.products));
    document.getElementById("searchInput").value = "";
  });

  // Fetch categories and create radio buttons
  const categorySection = document.getElementById("category-section");
  const categoriesUrl = "https://dummyjson.com/products/categories";

  fetch(categoriesUrl)
    .then((response) => response.json())
    .then((categories) => {
      categories.forEach((category) => {
        // console.log(category.name);
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "category";
        radio.value = category.name;
        radio.id = category.name;

        const label = document.createElement("label");
        label.htmlFor = category.name;
        label.textContent = category.name;

        categorySection.appendChild(radio);
        categorySection.appendChild(label);

        radio.addEventListener("change", () => filterByCategory(category.name));
      });
    });

  // Fetch and display products from selected category
  function filterByCategory(category) {
    const categoryUrl = `https://dummyjson.com/products/category/${category}`;
    fetch(categoryUrl)
      .then((response) => response.json())
      .then((data) => renderProducts(data.products));
  }

  // Clear category filters and show all products
  document
    .getElementById("clearCategoriesButton")
    .addEventListener("click", () => {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => renderProducts(data.products));
      document
        .querySelectorAll('input[name="category"]')
        .forEach((radio) => (radio.checked = false));
    });
});
