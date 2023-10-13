const endpoint = "http://localhost:3000/api";

$(document).ready(function () {
  renderTable();
  insertButton();
});

const renderTable = () => {
  fetch(`${endpoint}/get_item`)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data.data)) {
        console.error('Data is not an array:', data.data);
        return;
      }

      const tableBody = document.getElementById("table-body");
      tableBody.innerHTML = '';

      data.data.forEach(item => {
        const row =
          `<tr data-id="${item._id}">
            <td class="p-auto m-auto">${item.name}</td>
            <td class="p-auto m-auto">${item.price}</td>
            <td class="p-auto m-auto">${item.quantity}</td>
            <td class="p-auto m-auto"><button class="view-button btn btn-outline-info me-3">VIEW</button><button class="update-button btn btn-outline-secondary">EDIT</button></td>
          </tr>`;
        tableBody.insertAdjacentHTML("beforeend", row);
      });

      tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('view-button')) {
          const itemId = event.target.closest('tr').getAttribute('data-id');
          getItemById(itemId);
        } else if (event.target.classList.contains('update-button')) {
          const itemId = event.target.closest('tr').getAttribute('data-id');
          handleEdit(itemId);
        }
      });

      new DataTable(document.getElementById("item-table"));
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function getItemById(itemId) {
  fetch(`${endpoint}/get_item_by_id/${itemId}`)
    .then(response => response.json())
    .then(item => {
      const byId = item.data;
      document.getElementById('modal-name').textContent = byId.name;
      document.getElementById('modal-price').textContent = byId.price;
      document.getElementById('modal-quantity').textContent = byId.quantity;
      document.getElementById('modal-description').textContent = byId.description;
      const modal = new bootstrap.Modal(document.getElementById('detailModal'));
      modal.show();
    })
    .catch(error => {
      console.error('Error fetching item details:', error);
    });
}

function handleEdit(itemId) {
  fetch(`${endpoint}/get_item_by_id/${itemId}`)
    .then(response => response.json())
    .then(item => {
      const byId = item.data;
      document.getElementById('updateName').value = byId.name;
      document.getElementById('updatePrice').value = byId.price;
      document.getElementById('updateQuantity').value = byId.quantity;
      document.getElementById('updateDescription').value = byId.description;
      const updateItemModal = new bootstrap.Modal(document.getElementById('updateItemModal'));
      updateItemModal.show();
      const updateItemForm = document.getElementById('updateItemForm');
      updateItemForm.addEventListener('submit', function(event) {
        event.preventDefault();
        updateItem(itemId);
      });
    })
    .catch(error => {
      console.error('Error fetching item details:', error);
    });
}

function updateItem(itemId) {
  const updatedName = document.getElementById('updateName').value;
  const updatedPrice = parseFloat(document.getElementById('updatePrice').value);
  const updatedQuantity = parseInt(document.getElementById('updateQuantity').value);
  const updatedDescription = document.getElementById('updateDescription').value;
  const updatedItem = {
    name: updatedName,
    price: updatedPrice,
    quantity: updatedQuantity,
    description: updatedDescription
  };

  fetch(`${endpoint}/update_item/${itemId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedItem)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Item updated successfully!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          const updateItemModal = new bootstrap.Modal(document.getElementById('updateItemModal'));
          updateItemModal.hide();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
      } else {
        console.error('Error updating item:', data.message);
      }
    })
    .catch(error => {
      console.error('Error updating item:', error);
    });
}

const insertButton = () => {
  const createItemForm = document.getElementById("createItemForm");

  createItemForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);
    const itemQuantity = parseInt(document.getElementById("itemQuantity").value);
    const itemDescription = document.getElementById("itemDescription").value;

    fetch(`${endpoint}/insert_item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: itemName,
        price: itemPrice,
        quantity: itemQuantity,
        description: itemDescription,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Item created successfully!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            const createItemModal = new bootstrap.Modal(document.getElementById("createItemModal"));
            createItemModal.hide();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        } else {
          console.error("Error creating item:", data.message);
        }
      })
      .catch(error => console.error("Error creating item:", error));
  });

  createItemForm.addEventListener("reset", function (event) {
    const submitButton = document.getElementById("createItemModal").querySelector("button[type='submit']");
    submitButton.disabled = true;
  });

  const itemNameInput = document.getElementById("itemName");
  const itemPriceInput = document.getElementById("itemPrice");
  const itemQuantityInput = document.getElementById("itemQuantity");
  const itemDescriptionInput = document.getElementById("itemDescription");

  function checkFormCompletion() {
    return (
      itemNameInput.value.trim() !== "" &&
      itemPriceInput.value.trim() !== "" &&
      itemQuantityInput.value.trim() !== "" &&
      itemDescriptionInput.value.trim() !== ""
    );
  }

  function toggleSubmitButton() {
    const submitButton = document.getElementById("createItemModal").querySelector("button[type='submit']");
    submitButton.disabled = !checkFormCompletion();
  }

  itemNameInput.addEventListener("input", toggleSubmitButton);
  itemPriceInput.addEventListener("input", toggleSubmitButton);
  itemQuantityInput.addEventListener("input", toggleSubmitButton);
  itemDescriptionInput.addEventListener("input", toggleSubmitButton);
};
