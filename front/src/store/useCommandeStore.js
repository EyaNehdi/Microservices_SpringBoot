import { create } from 'zustand';
import { addCommande, editCommande, deleteCommande, getAllCommandes, getCommandeById } from '../api/service';

export const useCommandeStore = create((set) => ({
  commandes: [],
  commande: null,  // For storing a specific commande
  errors: "",
  
  // Fetch all commandes
  fetchAllCommandes: async () => {
    try {
      const response = await getAllCommandes();
      console.log('Fetched Commandes:', response.data);
      set({ commandes: response.data });
    } catch (error) {
      set({ errors: error.message });
    }
  },

  // Fetch a specific commande by ID
  fetchCommandeById: async (id) => {
    try {
      const response = await getCommandeById(id);
      set({ commande: response.data });
    } catch (error) {
      set({ errors: error.message });
    }
  },

  // Add new commande
  addCommande: async (commande) => {
    try {
      const response = await addCommande({
        nomCommande: commande.nomCommande,
        deliveryAddress: commande.deliveryAddress,
        totalPrice: commande.totalPrice,
      });
      set((state) => ({
        commandes: [...state.commandes, response.data]
      }));
      return response;
    } catch (error) {
      set({ errors: error.message });
    }
  },

  // Delete a commande
  deleteCommande: async (id) => {
    try {
      await deleteCommande(id);
      console.log("Commande with ID:", id, "has been deleted successfully.");
      set((state) => ({
        commandes: state.commandes.filter((commande) => commande._id !== id)
      }));
    } catch (error) {
      set({ errors: error.message });
    }
  },

  // Update a commande
  updateCommande: async (id, commande) => {
    try {
      const response = await editCommande(id, {
        nomCommande: commande.nomCommande,
        deliveryAddress: commande.deliveryAddress,
        totalPrice: commande.totalPrice,
      });
      set((state) => ({
        commandes: state.commandes.map((cmd) =>
          cmd._id === id ? response.data : cmd
        )
      }));
      return response;
    } catch (error) {
      set({ errors: error.message });
    }
  },
}));
