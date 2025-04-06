import { useState } from "react";
import { Form , Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useCommandeStore } from "../store/useCommandeStore";
import { useEffect } from "react";
import { getCommandeById } from "../api/service";

function CommandeForm() {
    const navigate = useNavigate();
    const { commandeId } = useParams();
    const {addCommande, updateCommande } = useCommandeStore();
    const [commande, setCommande] = useState({
        nomCommande:"",
        deliveryAddress:"",
        totalPrice:0,
    })
    const [isLoading, setIsLoading] = useState(true);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: commande
});
useEffect(() => {
    if (!commandeId) { // Make sure to check for the correct ID
        setIsLoading(false);
        return;
    }

    const fetchCommande = async () => {
        try {
            const response = await getCommandeById(commandeId); 
            if (response?.data) {
                const commandeData = response.data;
                Object.keys(commandeData).forEach((key) => setValue(key, commandeData[key])); 
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


const onSubmit = async (data) =>{
    console.log("Form data:", data);
    const {nomCommande,deliveryAddress,totalPrice} = data;
    let commandeResult = null;
    console.log(data)
    try{
    if (commandeId) {
        commandeResult = await updateCommande(commandeId,{
            nomCommande:data.nomCommande,
            deliveryAddress:data.deliveryAddress,
            totalPrice:data.totalPrice,
        });

    } else {
      commandeResult =  await addCommande({nomCommande,deliveryAddress,totalPrice});
        console.log(commandeResult);
    }
    }
    catch(error){
    console.error(error);
    }
    console.log(commandeResult.status);
    if (commandeResult.status === 200 || commandeResult.status === 201) {
        navigate("/");
    };}
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="nomCommande" className="mb-3">
            <Form.Label>Nom Commande</Form.Label>
            <Form.Control  placeholder="Donnez un nom de commande"  type="text"
            name="nomCommande" {...register("nomCommande")} />
             {
                errors.nomCommande && (
                    <Alert variant="danger">{errors.nomCommande.message}</Alert>
                )
            }
            
        </Form.Group>
        <Form.Group controlId="deliveryAddress" className="mb-3">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control placeholder="Donnez une adresse de livraison" type="text"
            name="deliveryAddress" {...register("deliveryAddress")} />
            {
                errors.deliveryAddress && (
                    <Alert variant="danger">{errors.deliveryAddress.message}</Alert>
                )
            }
            
        </Form.Group>
        <Form.Group controlId="totalPrice" className="mb-3">
            <Form.Label>Total Price</Form.Label>
            <Form.Control  placeholder="Donnez le prix de la commande"  type="number"
            name="totalPrice" {...register("totalPrice",{valueAsNumber : true})}  />
             {
                errors.totalPrice && (
                    <Alert variant="danger">{errors.totalPrice.message}</Alert>
                )
            }
           
        </Form.Group>
        <button type="submit" >{commandeId ? "Update Commande" : "Add Commande"}</button>
        <button type="reset" onClick={()=>{navigate("/")}}>Cancel</button>
    </Form>
    </>
  )
}


export default CommandeForm
