"use client"

import { useState, useEffect } from "react"
import axios from "axios"

function ProductForm({ refreshProducts, editingProduct, setEditingProduct }) {
  const [product, setProduct] = useState({
    nomProduit: "",
    description: "",
    prixUnitaire: 0,
    image: null,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    sendEmail: true,
    sendSms: true,
    emailTo: "admin@example.com",
    phoneTo: "+2164567890",
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (editingProduct) {
      setProduct({
        id: editingProduct.id,
        nomProduit: editingProduct.nomProduit,
        description: editingProduct.description,
        prixUnitaire: editingProduct.prixUnitaire,
        image: editingProduct.image,
      })

      // If there's an image URL, set it as preview
      if (editingProduct.imageUrl) {
        setImagePreview(editingProduct.imageUrl)
      } else {
        setImagePreview(null)
      }
    } else {
      resetForm()
    }
  }, [editingProduct])

  const resetForm = () => {
    setProduct({
      nomProduit: "",
      description: "",
      prixUnitaire: 0,
      image: null,
    })
    setImagePreview(null)
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

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProduct({
        ...product,
        image: file,
      })

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addProduct = async (productData) => {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append("nomProduit", productData.nomProduit)
    formData.append("description", productData.description)
    formData.append("prixUnitaire", productData.prixUnitaire)

    if (productData.image) {
      formData.append("image", productData.image)
    }

    const response = await axios.post("http://localhost:8089/produits/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    // Send notifications if enabled
    if (notificationSettings.sendEmail) {
      await sendEmailNotification(
        notificationSettings.emailTo,
        "New Product Added",
        `A new product "${productData.nomProduit}" has been added with price ${productData.prixUnitaire}€.`,
      )
    }

    if (notificationSettings.sendSms) {
      await sendSmsNotification(
        notificationSettings.phoneTo,
        `New product added: ${productData.nomProduit} - ${productData.prixUnitaire}€`,
      )
    }

    return response.data
  }

  const updateProduct = async (id, productData) => {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append("id", id)
    formData.append("nomProduit", productData.nomProduit)
    formData.append("description", productData.description)
    formData.append("prixUnitaire", productData.prixUnitaire)

    if (productData.image && typeof productData.image !== "string") {
      formData.append("image", productData.image)
    }

    const response = await axios.put(`http://localhost:8089/produits/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    // Send notifications if enabled
    if (notificationSettings.sendEmail) {
      await sendEmailNotification(
        notificationSettings.emailTo,
        "Product Updated",
        `The product "${productData.nomProduit}" has been updated. New price: ${productData.prixUnitaire}€.`,
      )
    }

    if (notificationSettings.sendSms) {
      await sendSmsNotification(
        notificationSettings.phoneTo,
        `Product updated: ${productData.nomProduit} - ${productData.prixUnitaire}€`,
      )
    }

    return response.data
  }

  const sendEmailNotification = async (to, subject, body) => {
    try {
      await axios.post(`http://localhost:8089/produits/sendMAIL`, null, {
        params: { to, subject, body },
      })
      console.log("Email notification sent successfully")
    } catch (error) {
      console.error("Failed to send email notification:", error)
    }
  }

  const sendSmsNotification = async (to, message) => {
    try {
      await axios.post(`http://localhost:8089/produits/sendSMS`, null, {
        params: { to, message },
      })
      console.log("SMS notification sent successfully")
    } catch (error) {
      console.error("Failed to send SMS notification:", error)
    }
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

      <div className="form-group">
        <label htmlFor="image">Product Image</label>
        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div className="image-preview">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Product preview"
              style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>

      <div className="notification-settings">
        <h3>Notification Settings</h3>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="sendEmail"
            name="sendEmail"
            checked={notificationSettings.sendEmail}
            onChange={handleNotificationChange}
          />
          <label htmlFor="sendEmail">Send Email Notification</label>
        </div>

        {notificationSettings.sendEmail && (
          <div className="form-group">
            <label htmlFor="emailTo">Email To</label>
            <input
              type="email"
              id="emailTo"
              name="emailTo"
              value={notificationSettings.emailTo}
              onChange={handleNotificationChange}
              placeholder="Enter email address"
            />
          </div>
        )}

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="sendSms"
            name="sendSms"
            checked={notificationSettings.sendSms}
            onChange={handleNotificationChange}
          />
          <label htmlFor="sendSms">Send SMS Notification</label>
        </div>

        {notificationSettings.sendSms && (
          <div className="form-group">
            <label htmlFor="phoneTo">Phone Number</label>
            <input
              type="text"
              id="phoneTo"
              name="phoneTo"
              value={notificationSettings.phoneTo}
              onChange={handleNotificationChange}
              placeholder="Enter phone number"
            />
          </div>
        )}
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
