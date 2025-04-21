import { Link } from "react-router-dom"
import { ShoppingBag, Package, BarChart2, Tag, TrendingUp, Settings } from "lucide-react"

function Home() {
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Your E-Commerce Product Management System</h1>
        <p className="hero-subtitle">
          A comprehensive solution to manage your online store's inventory, track sales, and optimize your product
          catalog
        </p>
    
      </div>

      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">
            <Package />
          </div>
          <h3>Product Inventory</h3>
          <p>
            Easily add, edit, and organize your product catalog. Keep track of stock levels, pricing, and product
            details in one centralized location.
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <BarChart2 />
          </div>
          <h3>Sales Analytics</h3>
          <p>
            Monitor product performance with detailed analytics. Identify top-selling items and optimize your inventory
            based on customer demand.
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Tag />
          </div>
          <h3>Pricing Management</h3>
          <p>
            Set competitive prices, create special offers, and manage discounts. Our system helps you maintain optimal
            pricing strategies for maximum profit.
          </p>
        </div>
      </div>

      <div className="stats-section">
        <h2>Your E-Commerce at a Glance</h2>
        <div className="stats-container">
          <div className="stat-card">
            <TrendingUp className="stat-icon" />
            <div className="stat-content">
              <h3>Product Growth</h3>
              <p className="stat-value">+15%</p>
              <p className="stat-description">Increase in product catalog this month</p>
            </div>
          </div>

          <div className="stat-card">
            <ShoppingBag className="stat-icon" />
            <div className="stat-content">
              <h3>Active Products</h3>
              <p className="stat-value">250+</p>
              <p className="stat-description">Products currently in your inventory</p>
            </div>
          </div>

          <div className="stat-card">
            <Settings className="stat-icon" />
            <div className="stat-content">
              <h3>System Efficiency</h3>
              <p className="stat-value">99.8%</p>
              <p className="stat-description">Uptime for your management system</p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}

export default Home
