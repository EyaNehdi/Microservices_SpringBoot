
import { useState, useEffect } from "react"
import ProductForm from "./ProductForm"
import axios from "axios"
import "./styles.css" // You'll need to create this CSS file

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8089/produits/all")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      alert("Failed to fetch products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const refreshProducts = () => {
    fetchProducts()
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    // Scroll to form
    document.querySelector(".product-form-container").scrollIntoView({ behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8089/produits/delete/${id}`)
      refreshProducts()
      setShowConfirmDelete(false)
      setProductToDelete(null)
      showNotification("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  const confirmDelete = (product) => {
    setProductToDelete(product)
    setShowConfirmDelete(true)
  }

  const cancelDelete = () => {
    setShowConfirmDelete(false)
    setProductToDelete(null)
  }

  const showNotification = (message) => {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.nomProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Product Management</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="content-container">
        <div className="product-form-container">
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <ProductForm
            refreshProducts={refreshProducts}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
          />
        </div>

        <div className="product-list-container">
          <h2>Products List</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              {searchTerm ? "No products match your search" : "No products found. Add your first product!"}
            </div>
          ) : (
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.nomProduit}</td>
                      <td className="description-cell">{product.description}</td>
                      <td className="price-cell">{product.prixUnitaire.toFixed(2)} €</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => confirmDelete(product)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete <strong>{productToDelete?.nomProduit}</strong>?
            </p>
            <p>This action cannot be undone.</p>
            <div className="dialog-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={() => handleDelete(productToDelete.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

