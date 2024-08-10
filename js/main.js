let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");
let clear = document.getElementById("clear");
let search = document.getElementById("search");
let searchByTitle = document.getElementById("searchByTitle");
let searchByCategory = document.getElementById("searchByCategory");
let rowData = document.getElementById("rowData");
let deleteAll = document.querySelector(".deleteAll");
let moodBtn = "Create";
let ind;
// get totla
function getTotal() {
  if (price.value != "" && taxes.value != "" && ads.value != "") {
    let resutlWithoutdiscount =
      Number(price.value) + Number(taxes.value) + Number(ads.value);
    let resutlDiscount =
      (Number(resutlWithoutdiscount) * Number(discount.value)) / 100;
    let resultFinaly = Number(resutlWithoutdiscount) - Number(resutlDiscount);
    total.innerHTML = resultFinaly;
    total.style.background = "green";
  } else {
    total.innerHTML = "";
    total.style.background = "rgb(106, 0, 0)";
  }
}

price.addEventListener("keyup", function () {
  getTotal();
});
taxes.addEventListener("keyup", function () {
  getTotal();
});
ads.addEventListener("keyup", function () {
  getTotal();
});
discount.addEventListener("keyup", function () {
  getTotal();
});

// create product
let dataProducts = [];

if (localStorage.product != null) {
  dataProducts = JSON.parse(localStorage.getItem("product"));
} else {
  dataProducts = [];
}

function getData() {
  // Validate inputs before proceeding
  if (!validateInputs()) {
    return;
  }

  let newProduct = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  };

  // save the data in localStorage
  if (moodBtn === "Create") {
    if (newProduct.count > 1) {
      for (let i = 0; i < newProduct.count; i++) {
        dataProducts.push(newProduct);
      }
    } else {
      dataProducts.push(newProduct);
    }
  } else {
    dataProducts[ind] = newProduct;
    moodBtn = "Create";
    create.innerHTML = "Create";
    create.classList.remove("bg-warning");
    document.querySelector(".countDev").style.display = "block";
  }

  localStorage.setItem("product", JSON.stringify(dataProducts));
}

create.addEventListener("click", function () {
  getData();
  showData();
});

// clear inputs

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}
clear.addEventListener("click", function () {
  clearData();
  total.style.background = "rgb(106, 0, 0)";
});

// read

function showData() {
  getTotal();
  let cartoona = ``;
  for (let i = 0; i < dataProducts.length; i++) {
    cartoona += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataProducts[i].title}</td>
        <td>${dataProducts[i].price}</td>
        <td>${dataProducts[i].taxes}</td>
        <td>${dataProducts[i].ads}</td>
        <td>${dataProducts[i].discount}</td>
        <td>${dataProducts[i].total}</td>
        <td>${dataProducts[i].category}</td>
        <td>
          <button onclick="updateData(${i})" class="btn btn-outline-warning p-2" id="update">
            update
          </button>                                 
        </td>
        <td>
          <button onclick="deleteData(${i})" class="btn btn-outline-danger p-2" id="delete">
            delete
          </button>
        </td>
      </tr>
    `;
  }
  rowData.innerHTML = cartoona;

  // تحديث نص زر "حذف الكل" بناءً على اللغة الحالية
  let currentLang = document.documentElement.lang;
  if (dataProducts.length > 0) {
    deleteAll.innerHTML = `
      <button onclick="deleteAllData()" id="deleteAll">
        ${currentLang === "ar" ? "حذف الكل" : "Delete All"} (${
      dataProducts.length
    })
      </button>
    `;
  } else {
    deleteAll.innerHTML = ``;
  }
}

showData();
// delete

function deleteData(i) {
  dataProducts.splice(i, 1);
  localStorage.product = JSON.stringify(dataProducts);
  showData();
}
function deleteAllData() {
  localStorage.clear();
  dataProducts.splice(0);
  showData();
}

// update

function updateData(i) {
  title.value = dataProducts[i].title;
  price.value = dataProducts[i].price;
  taxes.value = dataProducts[i].taxes;
  ads.value = dataProducts[i].ads;
  discount.value = dataProducts[i].discount;
  getTotal();
  document.querySelector(".countDev").style.display = "none";
  category.value = dataProducts[i].category;
  create.innerHTML = "Update";
  moodBtn = "Update";
  ind = i;
  create.classList.add("bg-warning");
  $("html, body").animate({ scrollTop: 0 }, 800); // 1000 milliseconds = 1 second
}

// search

let searchMood = "title";
function getSearchMood(id) {
  // searchByTitle
  // searchByCategory
  if (id == "searchByTitle") {
    searchMood = "title";
    search.placeholder = "Search By Title";
  } else {
    searchMood = "category";
    search.placeholder = "Search By Category";
  }
  search.focus();
  (search.value = ``), showData();
}

searchByTitle.addEventListener("click", function () {
  getSearchMood(this.id);
});
searchByCategory.addEventListener("click", function () {
  getSearchMood(this.id);
});

function searchData(value) {
  let cartoona = ``;

  for (let i = 0; i < dataProducts.length; i++) {
    if (searchMood === "title") {
      // تحقق من العنوان
      if (dataProducts[i].title.toLowerCase().includes(value.toLowerCase())) {
        cartoona += `
          <tr>
            <td>${i + 1}</td>
            <td>${dataProducts[i].title}</td>
            <td>${dataProducts[i].price}</td>
            <td>${dataProducts[i].taxes}</td>
            <td>${dataProducts[i].ads}</td>
            <td>${dataProducts[i].discount}</td>
            <td>${dataProducts[i].total}</td>
            <td>${dataProducts[i].category}</td>
            <td>
              <button onclick="updateData(${i})" class="btn btn-outline-warning p-2" id="update">
                update
              </button>
            </td>
            <td>
              <button onclick="deleteData(${i})" class="btn btn-outline-danger p-2" id="delete">
                delete
              </button>
            </td>
          </tr>
        `;
      }
    } else if (searchMood === "category") {
      // تحقق من الفئة
      if (
        dataProducts[i].category.toLowerCase().includes(value.toLowerCase())
      ) {
        cartoona += `
          <tr>
            <td>${i + 1}</td>
            <td>${dataProducts[i].title}</td>
            <td>${dataProducts[i].price}</td>
            <td>${dataProducts[i].taxes}</td>
            <td>${dataProducts[i].ads}</td>
            <td>${dataProducts[i].discount}</td>
            <td>${dataProducts[i].total}</td>
            <td>${dataProducts[i].category}</td>
            <td>
              <button onclick="updateData(${i})" class="btn btn-outline-warning p-2" id="update">
                update
              </button>
            </td>
            <td>
              <button onclick="deleteData(${i})" class="btn btn-outline-danger p-2" id="delete">
                delete
              </button>
            </td>
          </tr>
        `;
      }
    }
  }

  rowData.innerHTML = cartoona;
}

search.addEventListener("keyup", function () {
  searchData(this.value);
});

// clean data

// Function to validate the form inputs
function validateInputs() {
  let errors = [];

  // Validate title
  if (title.value.length < 3) {
    errors.push("Title must be at least 3 characters long.");
  }

  // Validate price
  if (Number(price.value) <= 0 || Number(price.value) > 100000) {
    errors.push("Price must be between 0 and 100,000.");
  }

  // Validate taxes
  if (Number(taxes.value) < 0 || Number(taxes.value) > 100000) {
    errors.push("Taxes must be between 0% and 1000000.");
  }

  // Validate ads
  if (Number(ads.value) < 0 || Number(ads.value) > 100000) {
    errors.push("Ads must be between 0% and 1000000.");
  }

  // Validate discount
  if (Number(discount.value) < 0 || Number(discount.value) > 100) {
    errors.push("Discount must be between 0% and 100%.");
  }
  if (Number(count.value) > 100) {
    errors.push("Count must be between 0 and 100.");
  }

  // Validate category (Optional: Add your own validation rules here)
  if (category.value.trim() === "") {
    errors.push("Category cannot be empty.");
  }
  if (Number(count.value > 100)) {
    errors.push("Count must be between 0 and 100.");
  }
  if (errors.length > 0) {
    displayErrors(errors);
    return false;
  } else {
    return true;
  }
}

// Function to display errors
function displayErrors(errors) {
  // Clear previous errors
  document.querySelectorAll(".error-message").forEach(function (el) {
    el.style.display = "none";
    el.innerHTML = "";
  });

  // Display new errors
  errors.forEach((error) => {
    let errorElement;
    if (error.field === "title") {
      errorElement = document.getElementById("titleError");
    } else if (error.field === "price") {
      errorElement = document.getElementById("priceError");
    } else if (error.field === "taxes") {
      errorElement = document.getElementById("taxesError");
    } else if (error.field === "ads") {
      errorElement = document.getElementById("adsError");
    } else if (error.field === "discount") {
      errorElement = document.getElementById("discountError");
    } else if (error.field === "category") {
    } else if (error.field === "count") {
      errorElement = document.getElementById("countError");
    } else if (error.field === "category") {
      errorElement = document.getElementById("categoryError");
    }

    if (errorElement) {
      errorElement.innerHTML = error.message;
      errorElement.style.display = "block";
    }
  });
}

function validateInputs() {
  let errors = [];

  if (title.value.length < 3) {
    errors.push({
      field: "title",
      message: "Title must be at least 3 characters long.",
    });
  }

  if (Number(price.value) <= 0 || Number(price.value) > 100000) {
    errors.push({
      field: "price",
      message: "Price must be between 0 and 100,000.",
    });
  }

  if (Number(taxes.value) < 0 || Number(taxes.value) > 1000) {
    errors.push({
      field: "taxes",
      message: "Taxes must be between 0 and 1000.",
    });
  }

  if (Number(ads.value) < 0 || Number(ads.value) > 1000) {
    errors.push({ field: "ads", message: "Ads must be between 0 and 1000." });
  }

  if (Number(discount.value) < 0 || Number(discount.value) > 100) {
    errors.push({
      field: "discount",
      message: "Discount must be between 0% and 100%.",
    });
  }
  if (Number(count.value) > 100) {
    errors.push({
      field: "count",
      message: "Count must be between 0 and 100.",
    });
  }

  if (category.value.trim() === "") {
    errors.push({ field: "category", message: "Category cannot be empty." });
  }

  if (errors.length > 0) {
    displayErrors(errors);
    return false;
  } else {
    return true;
  }
}

const modeBtn = document.getElementById("mode");

if (localStorage.getItem("theme")) {
  const theme = localStorage.getItem("theme");
  document.documentElement.dataset.theme = localStorage.getItem("theme");
  if (theme === "light") {
    modeBtn.classList.replace("fa-sun", "fa-moon");
  } else {
    modeBtn.classList.replace("fa-moon", "fa-sun");
  }
}

// ? =============> Event ===============>
modeBtn.addEventListener("click", function (e) {
  theme(e.target);
});

function theme(element) {
  const rootElement = document.documentElement;
  if (element.classList.contains("fa-sun")) {
    element.classList.replace("fa-sun", "fa-moon");
    rootElement.dataset.theme = "light";
    localStorage.setItem("theme", "light");
  } else {
    element.classList?.replace("fa-moon", "fa-sun");
    rootElement.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
  }
}

document
  .getElementById("languageToggle")
  .addEventListener("click", function () {
    var currentLang = document.documentElement.lang;

    if (currentLang === "en") {
      // تغيير اللغة إلى العربية
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";

      // تغيير النصوص
      document.getElementById("headerTitle").innerText = "عمليات CRUD";
      document.getElementById("headerDescription").innerText =
        "نظام إدارة المنتجات";

      document.getElementById("titleLabel").innerText = "اسم المنتج";
      document.getElementById("priceLabel").innerText = "سعر المنتج";
      document.getElementById("taxesLabel").innerText = "ضرائب المنتج";
      document.getElementById("adsLabel").innerText = "إعلانات المنتج";
      document.getElementById("discountLabel").innerText = "خصومات المنتج";
      document.getElementById("countLabel").innerText = "عدد المنتجات";
      document.getElementById("categoryLabel").innerText = "فئة المنتج";

      document.getElementById("create").innerText = "إنشاء";
      document.getElementById("clear").innerText = "حذف المدخلات";
      document.getElementById("searchByTitle").innerText =
        "البحث عن طريق العنوان";
      document.getElementById("searchByCategory").innerText =
        "البحث عن طريق الفئة";
      document.getElementById("deleteAll").innerText = "حذف الكل";
      document.getElementById("footer-info").innerText =
        " صُمم و طُورَ بواسطة عاشور على";

      // تعريب الجدول
      var tableHeader = document
        .getElementById("tableHeader")
        .querySelectorAll("th");
      tableHeader[0].innerText = "رقم";
      tableHeader[1].innerText = "العنوان";
      tableHeader[2].innerText = "السعر";
      tableHeader[3].innerText = "الضرائب";
      tableHeader[4].innerText = "الإعلانات";
      tableHeader[5].innerText = "الخصومات";
      tableHeader[6].innerText = "المجموع";
      tableHeader[7].innerText = "الفئة";
      tableHeader[8].innerText = "تحديث";
      tableHeader[9].innerText = "حذف";
    } else {
      // تغيير اللغة إلى الإنجليزية
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";

      // تغيير النصوص
      document.getElementById("headerTitle").innerText = "CRUD Operations";
      document.getElementById("headerDescription").innerText =
        "Product Management System";

      document.getElementById("titleLabel").innerText = "Product Name";
      document.getElementById("priceLabel").innerText = "Product Price";
      document.getElementById("taxesLabel").innerText = "Product Taxes";
      document.getElementById("adsLabel").innerText = "Product Ads";
      document.getElementById("discountLabel").innerText = "Product Discount";
      document.getElementById("countLabel").innerText = "Product Count";
      document.getElementById("categoryLabel").innerText = "Product Category";

      document.getElementById("create").innerText = "Create";
      document.getElementById("clear").innerText = "Clear Inputs";
      document.getElementById("searchByTitle").innerText = "Search By Title";
      document.getElementById("searchByCategory").innerText =
        "Search By Category";
      document.getElementById("deleteAll").innerText = "Delete All";
      document.getElementById("footer-info").innerText =
        "Design And Developed By Ashour Ali";

      // إعادة الجدول إلى الإنجليزية
      var tableHeader = document
        .getElementById("tableHeader")
        .querySelectorAll("th");
      tableHeader[0].innerText = "id";
      tableHeader[1].innerText = "title";
      tableHeader[2].innerText = "price";
      tableHeader[3].innerText = "taxes";
      tableHeader[4].innerText = "ads";
      tableHeader[5].innerText = "discount";
      tableHeader[6].innerText = "total";
      tableHeader[7].innerText = "category";
      tableHeader[8].innerText = "update";
      tableHeader[9].innerText = "delete";
    }
  });
