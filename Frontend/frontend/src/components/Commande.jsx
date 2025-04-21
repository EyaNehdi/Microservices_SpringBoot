import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function Commande({handleDelete, commande}) {

    const deleteCommande = () => {
        if (window.confirm(`Are you sure you want to delete the event: ${commande.nomCommande}?`)) {
            handleDelete(commande.id); // Call the delete function passed down from parent
        }
    };
  return (
    <>
      <Card>
        <Card.Body>
            <Card.Title>
                {commande.nomCommande}
                </Card.Title>
            <Card.Text>
               Delivery Address: {commande.deliveryAddress} <br/>
                <br/>
               Total price: {commande.totalPrice} <br/>
                <br/>
            </Card.Text>
                <Button className="btn btn-warning m-4">
          <Link to={`/update-commande/${commande._id}`} style={{ textDecoration: 'none', color: 'white' }}>
            Update
          </Link>
        </Button>
        <Button variant="danger" onClick={deleteCommande} className="m-4">
                        Delete
                    </Button>
            </Card.Body>
    </Card>
    </>
  )
}

export default Commande