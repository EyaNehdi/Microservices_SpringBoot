

import { useState, useEffect } from "react"
import axios from "axios"

function ProductForm({ refreshProducts, editingProduct, setEditingProduct }) {
  const [product, setProduct] = useState({
    nomProduit: "",
    description: "",
    prixUnitaire: 0,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingProduct) {
      setProduct({
        id: editingProduct.id,
        nomProduit: editingProduct.nomProduit,
        description: editingProduct.description,
        prixUnitaire: editingProduct.prixUnitaire,
      })
    } else {
      resetForm()
    }
  }, [editingProduct])

  const resetForm = () => {
    setProduct({
      nomProduit: "",
      description: "",
      prixUnitaire: 0,
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!product.nomProduit.trim()) {
      newErrors.nomProduit = "Product name is required"
    } else if (product.nomProduit.trim().length < 2) {
      newErrors.nomProduit = "Product name must be at least 2 characters"
    }

    if (!product.description.trim()) {
      newErrors.description = "Description is required"
    } else if (product.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters"
    }

    if (!product.prixUnitaire) {
      newErrors.prixUnitaire = "Price is required"
    } else if (product.prixUnitaire <= 0) {
      newErrors.prixUnitaire = "Price must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({
      ...product,
      [name]: name === "prixUnitaire" ? Number.parseFloat(value) || 0 : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const addProduct = async (productData) => {
    const response = await axios.post("http://localhost:8089/produits/add", productData)
    return response.data
  }

  const updateProduct = async (id, productData) => {
    const response = await axios.put(`http://localhost:8089/produits/update/${id}`, productData)
    return response.data
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (editingProduct) {
        await updateProduct(product.id, product)
        showNotification("Product updated successfully!")
        setEditingProduct(null)
      } else {
        await addProduct(product)
        showNotification("Product added successfully!")
      }

      resetForm()
      refreshProducts()
    } catch (error) {
      console.error("Error saving product:", error)
      alert(`Failed to ${editingProduct ? "update" : "add"} product. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
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

  const cancelEdit = () => {
    setEditingProduct(null)
    resetForm()
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="nomProduit">Product Name</label>
        <input
          type="text"
          id="nomProduit"
          name="nomProduit"
          placeholder="Enter product name"
          value={product.nomProduit}
          onChange={handleChange}
          className={errors.nomProduit ? "input-error" : ""}
        />
        {errors.nomProduit && <div className="error-message">{errors.nomProduit}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter product description"
          value={product.description}
          onChange={handleChange}
          className={errors.description ? "input-error" : ""}
          rows="3"
        />
        {errors.description && <div className="error-message">{errors.description}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="prixUnitaire">Price (€)</label>
        <input
          type="number"
          id="prixUnitaire"
          name="prixUnitaire"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={product.prixUnitaire}
          onChange={handleChange}
          className={errors.prixUnitaire ? "input-error" : ""}
        />
        {errors.prixUnitaire && <div className="error-message">{errors.prixUnitaire}</div>}
      </div>

      <div className="form-buttons">
        {editingProduct && (
          <button type="button" onClick={cancelEdit} className="cancel-button" disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm

