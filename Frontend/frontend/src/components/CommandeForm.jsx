import { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useCommandeStore } from "../store/useCommandeStore";
import { useEffect } from "react";
import { getCommandeById } from "../api/service";
import axios from "axios";
import { Plus } from "lucide-react";

function CommandeForm() {
  const navigate = useNavigate();
  const { commandeId } = useParams();
  const { addCommande, updateCommande } = useCommandeStore();
  const [commande, setCommande] = useState({
    nomCommande: "",
    deliveryAddress: "",
    totalPrice: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [productsFetched, setProductsFetched] = useState(false);
  const [productsOrder, setProductsOrder] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: commande,
  });
  useEffect(() => {
    if (commandeId) {
      handleFetchProducts(commandeId);
    }
  }, [commandeId, refreshTrigger]);

  useEffect(() => {
    if (!commandeId) {
      // Make sure to check for the correct ID
      setIsLoading(false);
      return;
    }

    const fetchCommande = async () => {
      try {
        const response = await getCommandeById(commandeId);
        if (response?.data) {
          const commandeData = response.data;
          Object.keys(commandeData).forEach((key) =>
            setValue(key, commandeData[key])
          );
          setCommande(commandeData);
        }
      } catch (error) {
        console.error("Error fetching commande:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommande();
  }, [commandeId, setValue]);

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    const { nomCommande, deliveryAddress, totalPrice } = data;
    try {
      let commandeResult = null;

      if (commandeId) {
        commandeResult = await updateCommande(commandeId, {
          nomCommande: data.nomCommande,
          deliveryAddress: data.deliveryAddress,
          totalPrice: data.totalPrice,
        });
      } else {
        commandeResult = await addCommande({
          nomCommande,
          deliveryAddress,
          totalPrice,
        });
      }

      console.log("API Response:", commandeResult);

      if (
        commandeResult &&
        (commandeResult.status === 200 || commandeResult.status === 201)
      ) {
        navigate("/listcommande");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const handleFetchProducts = async (commandeId) => {
    try {
      const res = await axios.get(
        `http://localhost:7000/commande/viewProducts/${commandeId}`
      );

      setProductsOrder(res.data);
      setProductsFetched(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const res = await axios.post(
        `http://localhost:7000/commande/remove-product/${commandeId}`,
        { productId: productId }
      );
      if (res) {
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProducts = (orderId) => {
    navigate(`/products?commandeId=${orderId}`);
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-white rounded shadow"
        style={{
          backgroundColor: "white",
          maxWidth: "800px",
          margin: "20px auto",
        }}
      >
        <h2 className="mb-4" style={{ color: "#333" }}>
          {commandeId ? "Modifier la Commande" : "Ajouter une Commande"}
        </h2>

        <Form.Group controlId="nomCommande" className="mb-3">
          <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
            Nom Commande
          </Form.Label>
          <Form.Control
            placeholder="Donnez un nom de commande"
            type="text"
            name="nomCommande"
            {...register("nomCommande")}
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid #6c757d",
              padding: "10px",
              display: "block",
              width: "100%",
            }}
          />
          {errors.nomCommande && (
            <Alert variant="danger" className="mt-2 py-2">
              {errors.nomCommande.message}
            </Alert>
          )}
        </Form.Group>

        <Form.Group controlId="deliveryAddress" className="mb-3">
          <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
            Delivery Address
          </Form.Label>
          <Form.Control
            placeholder="Donnez une adresse de livraison"
            type="text"
            name="deliveryAddress"
            {...register("deliveryAddress")}
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid #6c757d",
              padding: "10px",
              display: "block",
              width: "100%",
            }}
          />
          {errors.deliveryAddress && (
            <Alert variant="danger" className="mt-2 py-2">
              {errors.deliveryAddress.message}
            </Alert>
          )}
        </Form.Group>

        {/* Products List Section */}
        {commandeId && productsFetched && (
          <div className="mt-4 mb-4">
            <h3
              style={{
                color: "#333",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              Produits
            </h3>

            {productsFetched && productsOrder && productsOrder?.length > 0 ? (
              <div
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "left",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        Nom
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "left",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        Prix
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsOrder &&
                      productsOrder.map((product, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px solid #dee2e6" }}
                        >
                          <td style={{ padding: "10px", color: "#333" }}>
                            {product.nomProduit}
                          </td>
                          <td style={{ padding: "10px", color: "#6c757d" }}>
                            {product.description.length > 40
                              ? `${product.description.substring(0, 40)}...`
                              : product.description}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              textAlign: "right",
                              color: "#333",
                            }}
                          >
                            {product.prixUnitaire.toFixed(2)} €
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(product.id)}
                              style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                cursor: "pointer",
                              }}
                              title="Supprimer ce produit"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  textAlign: "center",
                  color: "#6c757d",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleAddProducts(commande._id)}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  title="Add Product"
                >
                  <Plus />
                </button>
                Aucun produit dans cette commande
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {commandeId ? "Update Commande" : "Add Commande"}
          </button>
          <button
            type="reset"
            onClick={() => {
              navigate("/listcommande");
            }}
            style={{
              backgroundColor: "transparent",
              color: "#6c757d",
              padding: "8px 16px",
              border: "1px solid #6c757d",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </Form>
    </>
  );
}

export default CommandeForm;
