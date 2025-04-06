import { useEffect } from "react";
import { useCommandeStore } from "../store/useCommandeStore";
import Commande from "./Commande";
function Commandes() {
    const {deleteCommande } = useCommandeStore();
    const { commandes, fetchAllCommandes } = useCommandeStore();
    useEffect(() => {
        fetchAllCommandes();
    }, [fetchAllCommandes]);
    const handleDelete = async (id) => {
        try {
            await deleteCommande(id);
            console.log("Attempting to delete commande with ID:", id);
            fetchAllCommandes();
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };
  return (
    <div>
       <h1>List des commandes</h1>
        <div className="d-flex flex-wrap justify-content-start">
        {commandes.map((commande, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2" key={index}>
            <Commande 
              commande={commande} 
               handleDelete={() => {handleDelete(commande._id)} }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Commandes
